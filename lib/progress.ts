import { findLesson, getContinent, getModule, modules } from "@/lib/curriculum";

const currentLessonIds = new Set(modules.flatMap((module) => module.lessonIds));

export function currentCompletions(completed: readonly string[]) {
  return completed.filter((id) => currentLessonIds.has(id));
}

export function levelFromXp(xp: number) {
  return Math.floor(Math.max(0, xp) / 100) + 1;
}

export function xpIntoLevel(xp: number) {
  return Math.max(0, xp) % 100;
}

export function localDateISO(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function shiftDateISO(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year || 1970, (month || 1) - 1, day || 1);
  date.setDate(date.getDate() + days);
  return localDateISO(date);
}

export function nextStreak(streak: number, lastActiveDate: string | null, today = localDateISO()) {
  if (lastActiveDate === today) {
    return { streak: Math.max(1, streak), lastActiveDate: today };
  }
  if (lastActiveDate === shiftDateISO(today, -1)) {
    return { streak: Math.max(0, streak) + 1, lastActiveDate: today };
  }
  return { streak: 1, lastActiveDate: today };
}

export function isLessonUnlocked(lessonId: string, completed: readonly string[]) {
  const lesson = findLesson(lessonId);
  if (!lesson) return false;
  const done = currentCompletions(completed);
  const continent = getContinent(lesson.continentId);
  const index = continent.lessonIds.indexOf(lessonId);
  if (index < 0) return false;
  if (index === 0) return true;
  return done.includes(continent.lessonIds[index - 1] ?? "");
}

export function isModuleFinished(moduleId: string, completed: readonly string[]) {
  const done = new Set(currentCompletions(completed));
  return getModule(moduleId).lessonIds.every((id) => done.has(id));
}

export type LessonVisualState = "locked" | "active" | "done";

export function lessonVisualState(lessonId: string, completed: readonly string[]): LessonVisualState {
  const done = currentCompletions(completed);
  if (done.includes(lessonId)) return "done";
  if (!isLessonUnlocked(lessonId, done)) return "locked";
  return "active";
}
