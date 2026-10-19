"use client";

import type { User } from "@supabase/supabase-js";
import { create } from "zustand";
import { playTone } from "@/lib/audio";
import { questionsForLesson, findLesson } from "@/lib/curriculum";
import { isFlagCode } from "@/lib/flags";
import { nextStreak } from "@/lib/progress";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { MAX_HEARTS, XP_PER_CORRECT, type AuthResult, type LessonSession, type Profile, type Selection } from "@/lib/types";

const STORAGE_KEY = "geoduolingo.v1";

type Db = {
  version: 1;
  currentEmail: string | null;
  users: Record<string, Profile>;
  avatars: Record<string, string>;
};

type AppState = {
  ready: boolean;
  authMode: "demo" | "supabase";
  profile: Profile | null;
  session: LessonSession | null;
  saveError: string | null;
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  startLesson: (lessonId: string) => void;
  setRegion: (regionId: string) => void;
  setChoice: (optionId: string) => void;
  checkAnswer: () => void;
  nextQuestion: () => void;
  setAvatarFlag: (code: string) => void;
  clearSaveError: () => void;
};

function emptyDb(): Db {
  return { version: 1, currentEmail: null, users: {}, avatars: {} };
}

function readFlag(value: unknown) {
  return isFlagCode(value) ? value : null;
}

function missingAvatarColumn(error: { message?: string; code?: string; details?: string } | null) {
  if (!error) return false;
  const text = `${error.code ?? ""} ${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
  return text.includes("avatar_flag") || text.includes("42703") || text.includes("pgrst204");
}

function isProfile(value: unknown): value is Profile {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.email === "string" &&
    typeof row.displayName === "string" &&
    typeof row.xp === "number" &&
    typeof row.streak === "number" &&
    (row.lastActiveDate === null || typeof row.lastActiveDate === "string") &&
    Array.isArray(row.completedLessonIds) &&
    row.completedLessonIds.every((id) => typeof id === "string")
  );
}

function loadDb(): Db {
  if (typeof window === "undefined") return emptyDb();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyDb();
    const parsed = JSON.parse(raw) as Partial<Db>;
    if (parsed.version !== 1 || !parsed.users || typeof parsed.users !== "object") return emptyDb();
    const avatars: Record<string, string> = {};
    if (parsed.avatars && typeof parsed.avatars === "object") {
      for (const [id, code] of Object.entries(parsed.avatars)) {
        const flag = readFlag(code);
        if (flag) avatars[id] = flag;
      }
    }
    const users: Record<string, Profile> = {};
    for (const [email, profile] of Object.entries(parsed.users)) {
      if (isProfile(profile)) {
        const avatarFlag = readFlag(profile.avatarFlag) ?? avatars[profile.id] ?? null;
        users[email] = { ...profile, avatarFlag };
        if (avatarFlag) avatars[profile.id] = avatarFlag;
      }
    }
    return {
      version: 1,
      currentEmail: typeof parsed.currentEmail === "string" ? parsed.currentEmail : null,
      users,
      avatars,
    };
  } catch {
    return emptyDb();
  }
}

function saveDb(db: Db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function saveDemoProfile(profile: Profile) {
  const db = loadDb();
  db.users[profile.email] = profile;
  db.currentEmail = profile.email;
  if (profile.avatarFlag) db.avatars[profile.id] = profile.avatarFlag;
  saveDb(db);
}

function rememberAvatar(profile: Profile) {
  if (!profile.avatarFlag) return;
  const db = loadDb();
  db.avatars[profile.id] = profile.avatarFlag;
  if (db.users[profile.email]) db.users[profile.email] = { ...db.users[profile.email], avatarFlag: profile.avatarFlag };
  saveDb(db);
}

function localAvatar(id: string) {
  return loadDb().avatars[id] ?? null;
}

function nameFromEmail(email: string) {
  const local = email.split("@")[0]?.replace(/[._-]+/g, " ").trim() ?? "";
  return local.slice(0, 32) || "Оқушы";
}

function makeProfile(email: string, displayName: string, id = `demo-${email}`): Profile {
  return {
    id,
    email,
    displayName,
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    completedLessonIds: [],
    avatarFlag: null,
  };
}

function cleanEmail(email: string) {
  return email.trim().toLowerCase();
}

function validateCredentials(email: string, password: string): { email: string; error: string | null } {
  const cleaned = cleanEmail(email);
  if (!cleaned.includes("@") || !cleaned.split("@")[1]?.includes(".")) {
    return { email: cleaned, error: "Жарамды пошта жаз." };
  }
  if (password.length === 0) return { email: cleaned, error: "Құпия сөзді жаз." };
  if (isSupabaseConfigured && password.length < 6) {
    return { email: cleaned, error: "Құпия сөз кемінде 6 таңбадан тұруы керек." };
  }
  return { email: cleaned, error: null };
}

function mapAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login") || lower.includes("invalid credentials")) {
    return "Пошта немесе құпия сөз қате.";
  }
  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "Бұл пошта бұрын тіркелген.";
  }
  if (lower.includes("password")) return "Құпия сөз кемінде 6 таңбадан тұруы керек.";
  if (lower.includes("email")) return "Пошта қате сияқты.";
  return "Кіру сәтсіз аяқталды. Қайта көріңіз.";
}

function numberFrom(value: unknown) {
  const numeric = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

const profileColumns = "id, email, display_name, xp, streak, last_active_date";

async function readProfileRow(userId: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");
  const withFlag = await supabase.from("profiles").select(`${profileColumns}, avatar_flag`).eq("id", userId).maybeSingle();
  if (!withFlag.error) return withFlag.data as Record<string, unknown> | null;
  if (!missingAvatarColumn(withFlag.error)) throw withFlag.error;
  const plain = await supabase.from("profiles").select(profileColumns).eq("id", userId).maybeSingle();
  if (plain.error) throw plain.error;
  return plain.data as Record<string, unknown> | null;
}

async function upsertProfile(profile: Profile) {
  const supabase = getSupabase();
  if (!supabase) return;
  const base = {
    id: profile.id,
    email: profile.email,
    display_name: profile.displayName,
    xp: profile.xp,
    streak: profile.streak,
    last_active_date: profile.lastActiveDate,
  };
  const payload = profile.avatarFlag ? { ...base, avatar_flag: profile.avatarFlag } : base;
  const first = await supabase.from("profiles").upsert(payload);
  if (!first.error) return;
  if (profile.avatarFlag && missingAvatarColumn(first.error)) {
    const second = await supabase.from("profiles").upsert(base);
    if (second.error) throw second.error;
    return;
  }
  throw first.error;
}

async function profileFromUser(user: User): Promise<Profile> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not configured");
  let row = await readProfileRow(user.id);
  if (!row) {
    const displayName =
      typeof user.user_metadata?.display_name === "string" && user.user_metadata.display_name.trim()
        ? user.user_metadata.display_name.trim().slice(0, 40)
        : nameFromEmail(user.email ?? "");
    const inserted = {
      id: user.id,
      email: user.email,
      display_name: displayName,
      xp: 0,
      streak: 0,
      last_active_date: null,
    };
    const { error: insertError } = await supabase.from("profiles").insert(inserted);
    if (insertError) throw insertError;
    row = (await readProfileRow(user.id)) ?? { ...inserted, avatar_flag: null };
  }

  const { data: progress, error: progressError } = await supabase
    .from("lesson_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id);
  if (progressError) throw progressError;

  const completedLessonIds = (Array.isArray(progress) ? progress : [])
    .map((item) => item as Record<string, unknown>)
    .filter((item) => item.completed === true && typeof item.lesson_id === "string")
    .map((item) => item.lesson_id as string);

  const email = typeof row.email === "string" && row.email ? row.email : (user.email ?? "");
  const displayName =
    typeof row.display_name === "string" && row.display_name.trim()
      ? row.display_name
      : nameFromEmail(email);

  const remoteFlag = readFlag(row.avatar_flag);
  const avatarFlag = remoteFlag ?? localAvatar(user.id);
  return {
    id: user.id,
    email,
    displayName,
    xp: numberFrom(row.xp),
    streak: numberFrom(row.streak),
    lastActiveDate: typeof row.last_active_date === "string" ? row.last_active_date : null,
    completedLessonIds,
    avatarFlag,
  };
}

async function persistOutcome(profile: Profile, session: LessonSession, passed: boolean) {
  if (!isSupabaseConfigured) {
    saveDemoProfile(profile);
    return;
  }
  const supabase = getSupabase();
  if (!supabase) return;
  await upsertProfile(profile);
  if (!passed) return;
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: profile.id,
      lesson_id: session.lessonId,
      module_id: session.moduleId,
      completed: true,
      xp_earned: session.xpEarned,
      mistakes: session.mistakes,
      completed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) throw error;
}

function currentQuestion(session: LessonSession) {
  return questionsForLesson(session.lessonId)[session.index];
}

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  authMode: isSupabaseConfigured ? "supabase" : "demo",
  profile: null,
  session: null,
  saveError: null,

  hydrate: async () => {
    if (get().ready) return;
    if (!isSupabaseConfigured) {
      const db = loadDb();
      const profile = db.currentEmail ? (db.users[db.currentEmail] ?? null) : null;
      set({ profile, ready: true, authMode: "demo" });
      return;
    }
    try {
      const supabase = getSupabase();
      const sessionResult = await supabase?.auth.getSession();
      const user = sessionResult?.data.session?.user;
      if (!user) {
        set({ profile: null, ready: true, authMode: "supabase" });
        return;
      }
      const profile = await profileFromUser(user);
      set({ profile, ready: true, authMode: "supabase" });
    } catch {
      set({
        profile: null,
        ready: true,
        authMode: "supabase",
        saveError: "Supabase сессиясын оқу мүмкін болмады.",
      });
    }
  },

  login: async (email, password) => {
    const checked = validateCredentials(email, password);
    if (checked.error) return { ok: false, message: checked.error };
    if (!isSupabaseConfigured) {
      const db = loadDb();
      const profile = db.users[checked.email] ?? makeProfile(checked.email, nameFromEmail(checked.email));
      saveDemoProfile(profile);
      set({ profile, saveError: null });
      return { ok: true };
    }
    try {
      const supabase = getSupabase();
      if (!supabase) return { ok: false, message: "Supabase бапталмаған." };
      const { data, error } = await supabase.auth.signInWithPassword({
        email: checked.email,
        password,
      });
      if (error || !data.user) return { ok: false, message: mapAuthError(error?.message ?? "") };
      const profile = await profileFromUser(data.user);
      set({ profile, saveError: null });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? mapAuthError(error.message) : "Кіру сәтсіз аяқталды.";
      return { ok: false, message };
    }
  },

  signup: async (email, password, displayName) => {
    const name = displayName.trim().slice(0, 40);
    if (name.length < 2) return { ok: false, message: "Аты-жөніңді жаз." };
    const checked = validateCredentials(email, password);
    if (checked.error) return { ok: false, message: checked.error };
    if (!isSupabaseConfigured) {
      const db = loadDb();
      const existing = db.users[checked.email];
      const profile = existing ? { ...existing, displayName: name } : makeProfile(checked.email, name);
      saveDemoProfile(profile);
      set({ profile, saveError: null });
      return { ok: true };
    }
    try {
      const supabase = getSupabase();
      if (!supabase) return { ok: false, message: "Supabase бапталмаған." };
      const { data, error } = await supabase.auth.signUp({
        email: checked.email,
        password,
        options: { data: { display_name: name } },
      });
      if (error) return { ok: false, message: mapAuthError(error.message) };
      if (!data.user || !data.session) {
        return {
          ok: false,
          needsConfirmation: true,
          message: "Поштаңа растау сілтемесі жіберілді. Растаған соң кір.",
        };
      }
      const profile = await profileFromUser(data.user);
      const named = { ...profile, displayName: name };
      try {
        await upsertProfile(named);
      } catch {
        return { ok: false, message: "Профиль сақталмады. Қайта көріңіз." };
      }
      set({ profile: named, saveError: null });
      return { ok: true };
    } catch (error) {
      const message = error instanceof Error ? mapAuthError(error.message) : "Тіркелу сәтсіз аяқталды.";
      return { ok: false, message };
    }
  },

  logout: async () => {
    if (isSupabaseConfigured) {
      const supabase = getSupabase();
      await supabase?.auth.signOut();
    } else {
      const db = loadDb();
      db.currentEmail = null;
      saveDb(db);
    }
    set({ profile: null, session: null, saveError: null });
  },

  startLesson: (lessonId) => {
    const lesson = findLesson(lessonId);
    const profile = get().profile;
    const current = get().session;
    if (!lesson || !profile) return;
    if (current?.lessonId === lessonId && current.status === "active") return;
    const count = questionsForLesson(lessonId).length;
    set({
      session: {
        lessonId,
        moduleId: lesson.moduleId,
        index: 0,
        hearts: MAX_HEARTS,
        xpEarned: 0,
        mistakes: 0,
        status: "active",
        checked: false,
        selected: null,
        lastResult: null,
        answers: Array.from({ length: count }, () => "pending" as const),
        streakBefore: profile.streak,
      },
      saveError: null,
    });
  },

  setRegion: (regionId) => {
    const session = get().session;
    const question = session ? currentQuestion(session) : undefined;
    if (!session || session.status !== "active" || session.checked || question?.type !== "pinpoint") return;
    set({ session: { ...session, selected: { type: "pinpoint", regionId } } });
  },

  setChoice: (optionId) => {
    const session = get().session;
    const question = session ? currentQuestion(session) : undefined;
    if (!session || session.status !== "active" || session.checked) return;
    if (!question || question.type === "pinpoint") return;
    set({ session: { ...session, selected: { type: "choice", optionId } } });
  },

  checkAnswer: () => {
    const session = get().session;
    if (!session || session.status !== "active" || session.checked || !session.selected) return;
    const question = currentQuestion(session);
    if (!question) return;
    let correct = false;
    const selected: Selection = session.selected;
    if (question.type === "pinpoint") {
      if (selected.type !== "pinpoint") return;
      correct = selected.regionId === question.placeId;
    } else {
      if (selected.type !== "choice") return;
      correct = selected.optionId === question.placeId;
    }
    playTone(correct ? "ok" : "bad");
    const answers = session.answers.slice();
    answers[session.index] = correct ? "correct" : "wrong";
    set({
      session: {
        ...session,
        checked: true,
        hearts: correct ? session.hearts : Math.max(0, session.hearts - 1),
        xpEarned: session.xpEarned + (correct ? XP_PER_CORRECT : 0),
        mistakes: session.mistakes + (correct ? 0 : 1),
        lastResult: { correct },
        answers,
        selected,
      },
    });
  },

  nextQuestion: () => {
    const session = get().session;
    const profile = get().profile;
    if (!session || !profile || !session.checked || session.status !== "active") return;
    const total = questionsForLesson(session.lessonId).length;
    const failed = session.hearts <= 0;
    const finished = session.index >= total - 1;
    if (!failed && !finished) {
      set({
        session: {
          ...session,
          index: session.index + 1,
          checked: false,
          selected: null,
          lastResult: null,
        },
      });
      return;
    }
    const passed = !failed;
    const completed = new Set(profile.completedLessonIds);
    if (passed) completed.add(session.lessonId);
    const streak = passed ? nextStreak(profile.streak, profile.lastActiveDate) : null;
    const nextProfile: Profile = {
      ...profile,
      xp: profile.xp + session.xpEarned,
      streak: streak ? streak.streak : profile.streak,
      lastActiveDate: streak ? streak.lastActiveDate : profile.lastActiveDate,
      completedLessonIds: [...completed],
    };
    const nextSession: LessonSession = { ...session, status: passed ? "passed" : "failed" };
    set({ profile: nextProfile, session: nextSession });
    void persistOutcome(nextProfile, nextSession, passed).catch(() => {
      set({ saveError: "Прогресс сақталмады. Интернетті тексеріп, сабақты қайта аяқта." });
    });
  },

  setAvatarFlag: (code) => {
    const profile = get().profile;
    if (!profile || !isFlagCode(code)) return;
    const next = { ...profile, avatarFlag: code };
    set({ profile: next });
    if (!isSupabaseConfigured) {
      saveDemoProfile(next);
      return;
    }
    rememberAvatar(next);
    void upsertProfile(next).catch(() => {
      // The flag stays on this device when the remote column is missing.
    });
  },

  clearSaveError: () => set({ saveError: null }),
}));
