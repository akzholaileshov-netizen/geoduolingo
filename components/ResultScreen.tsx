"use client";

import { Flame, Star, Trophy, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { DuoButton } from "@/components/DuoButton";
import { Splash } from "@/components/Providers";
import { useRequireProfile } from "@/components/AppShell";
import { findLesson, nextLessonId } from "@/lib/curriculum";
import { isLessonUnlocked, levelFromXp } from "@/lib/progress";
import { useAppStore } from "@/store/useAppStore";

export function ResultScreen() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params.lessonId;
  const lesson = findLesson(lessonId);
  const profile = useRequireProfile();
  const session = useAppStore((state) => state.session);
  const router = useRouter();
  const ready = session && session.lessonId === lessonId && session.status !== "active";

  useEffect(() => {
    if (!profile) return;
    if (!session || session.lessonId !== lessonId) {
      router.replace("/");
      return;
    }
    if (session.status === "active") router.replace(`/lesson/${lessonId}`);
  }, [profile, session, lessonId, router]);

  if (!profile || !ready || !lesson || !session) return <Splash />;

  const passed = session.status === "passed";
  const nextId = nextLessonId(lesson.id);
  const next = nextId ? findLesson(nextId) : undefined;
  const nextOpen = Boolean(nextId && isLessonUnlocked(nextId, profile.completedLessonIds));
  const previousLevel = levelFromXp(profile.xp - session.xpEarned);
  const level = levelFromXp(profile.xp);
  const streakGrew = passed && profile.streak > session.streakBefore;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 py-8">
      <div className={`mx-auto grid h-28 w-28 place-items-center rounded-full ${passed ? "bg-[#e8f8d8] text-[#58cc02]" : "bg-[#ffecec] text-[#ff4b4b]"}`}>
        {passed ? <Trophy size={56} /> : <XCircle size={56} />}
      </div>
      <h1 className="mt-4 text-center text-3xl font-extrabold" data-testid="result-status">
        {passed ? "Керемет!" : "Жүректер бітті"}
      </h1>
      <p className="mt-1 text-center font-bold text-[#777]">{lesson.titleKk}</p>
      <div className="mt-6 space-y-3">
        <Row testId="result-xp" icon={<Star fill="#ffc800" className="text-[#ffc800]" />} label="Жиналған XP" value={`+${session.xpEarned}`} />
        <Row testId="result-mistakes" icon={<XCircle className="text-[#ff4b4b]" />} label="Қателер" value={String(session.mistakes)} />
        <Row
          testId="result-streak"
          icon={<Flame fill="#ff9600" className="text-[#ff9600]" />}
          label="Күнделікті серия"
          value={`${profile.streak} күн${streakGrew ? " · жаңарды" : ""}`}
        />
      </div>
      {level > previousLevel ? (
        <p className="mt-4 rounded-2xl bg-[#fff4d6] px-4 py-3 text-center font-extrabold text-[#b86e00]">
          Жаңа деңгей: {level}
        </p>
      ) : null}
      <div className="mt-auto space-y-3 pt-8">
        {passed && next && nextOpen ? (
          <DuoButton onClick={() => router.push(`/lesson/${next.id}`)}>Келесі сабақ</DuoButton>
        ) : null}
        {!passed ? <DuoButton onClick={() => router.push(`/lesson/${lesson.id}`)}>Қайталау</DuoButton> : null}
        <DuoButton variant="white" onClick={() => router.push("/")}>
          Басты бетке
        </DuoButton>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  testId,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  testId: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl border-2 border-[#e5e5e5] bg-white px-4 py-4" data-testid={testId}>
      <span className="flex items-center gap-2 font-extrabold">
        {icon}
        {label}
      </span>
      <span className="font-extrabold">{value}</span>
    </div>
  );
}
