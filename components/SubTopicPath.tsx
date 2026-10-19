"use client";

import { Check, Lock, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getLesson } from "@/lib/curriculum";
import { subTopicVisualState } from "@/lib/progress";
import { useAppStore } from "@/store/useAppStore";

export function SubTopicPath({ sectionId, highlightId }: { sectionId: string; highlightId?: string | null }) {
  const profile = useAppStore((state) => state.profile);
  const router = useRouter();
  const [note, setNote] = useState<string | null>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lesson = getLesson(sectionId);
  const completed = profile?.completedLessonIds ?? [];
  const ids = lesson.subTopics.map((topic) => topic.id);
  const highlight =
    highlightId && ids.includes(highlightId) && subTopicVisualState(highlightId, completed) === "active" ? highlightId : null;

  useEffect(() => {
    if (!highlight) return;
    highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlight]);

  if (!profile) return null;

  return (
    <div>
      {note ? (
        <p className="mb-4 rounded-2xl bg-[#fff4d6] px-4 py-3 text-center text-sm font-extrabold text-[#b86e00]">{note}</p>
      ) : null}
      <div className="relative mx-auto flex max-w-xs flex-col items-center gap-2 py-2">
        <div className="absolute top-8 bottom-8 w-1.5 rounded-full bg-[#e5e5e5]" />
        {lesson.subTopics.map((topic, index) => {
          const state = subTopicVisualState(topic.id, completed);
          const offset = index % 2 === 0 ? -52 : 52;
          const pulsing = topic.id === highlight;
          return (
            <div
              key={topic.id}
              ref={pulsing ? highlightRef : undefined}
              className="relative z-10 py-2"
              style={{ transform: `translateX(${offset}px)` }}
            >
              <button
                type="button"
                data-testid={`skill-node-${topic.id}`}
                data-state={state}
                data-highlight={pulsing ? "true" : "false"}
                aria-label={topic.titleKk}
                onClick={() => {
                  if (state === "locked") {
                    setNote("Алдымен алдыңғы тақырыпты аяқта.");
                    return;
                  }
                  setNote(null);
                  router.push(`/lesson/${topic.id}`);
                }}
                className={`grid h-20 w-20 place-items-center rounded-full border-b-4 text-white ${
                  state === "locked" ? "border-[#cfcfcf] bg-[#e5e5e5] text-[#afafaf]" : "border-[#46a302] bg-[#58cc02]"
                } ${state === "active" ? "ring-4 ring-[#c8f7a0]" : ""} ${pulsing ? "animate-lesson-pulse" : ""}`}
              >
                {state === "locked" ? <Lock size={28} /> : null}
                {state === "done" ? <Check size={32} strokeWidth={3} /> : null}
                {state === "active" ? <Star size={30} fill="white" className="animate-floaty" /> : null}
              </button>
              <p className={`mt-2 w-32 text-center text-xs font-extrabold leading-tight ${state === "locked" ? "text-[#afafaf]" : "text-[#3c3c3c]"}`}>
                {topic.titleKk}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
