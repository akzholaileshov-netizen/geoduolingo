"use client";

import { Check, Lock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getLesson, modules } from "@/lib/curriculum";
import { lessonVisualState } from "@/lib/progress";
import { useAppStore } from "@/store/useAppStore";

export function SkillTree() {
  const profile = useAppStore((state) => state.profile);
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);
  if (!profile) return null;
  const completed = profile.completedLessonIds;

  return (
    <div className="space-y-5">
      {note ? (
        <p className="rounded-2xl bg-[#fff4d6] px-4 py-3 text-center text-sm font-extrabold text-[#b86e00]">{note}</p>
      ) : null}
      {modules.map((module) => {
        const done = module.lessonIds.filter((id) => completed.includes(id)).length;
        return (
          <section key={module.id} className="rounded-[28px] border-2 border-[#e5e5e5] bg-white px-3 py-5">
            <div className="px-3">
              <div className="flex items-start gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f4fbf0] text-2xl">
                  {module.emoji}
                </span>
                <div>
                  <h2 className="text-lg font-extrabold leading-tight text-[#3c3c3c]">{module.titleKk}</h2>
                  <p className="mt-1 text-sm font-bold text-[#777]">
                    {done}/{module.lessonIds.length} сабақ · {module.descriptionKk}
                  </p>
                </div>
              </div>
            </div>
            <div className="relative mx-auto mt-6 flex max-w-xs flex-col items-center gap-2 py-2">
              <div className="absolute top-8 bottom-8 w-1.5 rounded-full bg-[#e5e5e5]" />
              {module.lessonIds.map((lessonId, index) => {
                const lesson = getLesson(lessonId);
                const state = lessonVisualState(lessonId, completed);
                const offset = index % 2 === 0 ? -52 : 52;
                return (
                  <div key={lessonId} className="relative z-10 py-2" style={{ transform: `translateX(${offset}px)` }}>
                    <button
                      type="button"
                      data-testid={`skill-node-${lessonId}`}
                      data-state={state}
                      aria-label={lesson.titleKk}
                      onClick={() => {
                        if (state === "locked") {
                          setNote("Алдымен алдыңғы сабақты аяқта.");
                          return;
                        }
                        setNote(null);
                        router.push(`/lesson/${lessonId}`);
                      }}
                      className={`grid h-20 w-20 place-items-center rounded-full border-b-4 text-white ${
                        state === "locked"
                          ? "border-[#cfcfcf] bg-[#e5e5e5] text-[#afafaf]"
                          : "border-[#46a302] bg-[#58cc02]"
                      } ${state === "active" ? "ring-4 ring-[#c8f7a0]" : ""}`}
                    >
                      {state === "locked" ? <Lock size={28} /> : null}
                      {state === "done" ? <Check size={32} strokeWidth={3} /> : null}
                      {state === "active" ? <Star size={30} fill="white" className="animate-floaty" /> : null}
                    </button>
                    <p
                      className={`mt-2 w-28 text-center text-xs font-extrabold leading-tight ${
                        state === "locked" ? "text-[#afafaf]" : "text-[#3c3c3c]"
                      }`}
                    >
                      {lesson.titleKk}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
