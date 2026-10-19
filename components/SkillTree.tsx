"use client";

import { useRouter } from "next/navigation";
import { modules } from "@/lib/curriculum";
import { completedSectionCount } from "@/lib/progress";
import { useAppStore } from "@/store/useAppStore";

export function SkillTree() {
  const profile = useAppStore((state) => state.profile);
  const router = useRouter();
  if (!profile) return null;
  const completed = profile.completedLessonIds;

  return (
    <div className="space-y-5">
      {modules.map((module) => {
        const done = completedSectionCount(module.id, completed);
        return (
          <button
            key={module.id}
            type="button"
            data-testid={`module-${module.id}`}
            onClick={() => router.push("/eurasia")}
            className="w-full rounded-[28px] border-2 border-[#e5e5e5] bg-white px-4 py-5 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#f4fbf0] text-3xl">{module.emoji}</span>
              <span>
                <span className="block text-xl font-extrabold text-[#3c3c3c]">{module.titleKk}</span>
                <span className="mt-1 block text-sm font-bold text-[#777]">
                  {done}/{module.lessonIds.length} сабақ · {module.descriptionKk}
                </span>
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
