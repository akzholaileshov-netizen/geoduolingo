"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { DuoButton } from "@/components/DuoButton";
import { SubTopicPath } from "@/components/SubTopicPath";
import { findContinent, findLesson } from "@/lib/curriculum";

export function SectionScreen() {
  const params = useParams<{ continentId: string; sectionId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const continent = findContinent(params.continentId);
  const lesson = findLesson(params.sectionId);
  const matches = Boolean(continent && lesson && lesson.continentId === continent.id);

  return (
    <AppShell>
      <button
        type="button"
        onClick={() => router.push(continent ? `/continent/${continent.id}` : "/eurasia")}
        className="mb-4 inline-flex items-center gap-1 text-sm font-extrabold text-[#1cb0f6]"
      >
        <ChevronLeft size={18} /> {continent ? continent.titleKk : "Еуразия"}
      </button>
      {matches && continent && lesson ? (
        <section className="rounded-[28px] border-2 border-[#e5e5e5] bg-white px-3 py-5">
          <div className="px-3">
            <h1 className="text-2xl font-extrabold text-[#3c3c3c]" data-testid="section-title">
              {continent.emoji} {lesson.titleKk}
            </h1>
            <p className="mt-1 text-sm font-bold text-[#777]">{continent.titleKk}</p>
          </div>
          <div className="mt-4">
            <SubTopicPath sectionId={lesson.id} highlightId={search.get("focus")} />
          </div>
        </section>
      ) : (
        <div className="rounded-[28px] border-2 border-[#e5e5e5] bg-white p-6 text-center">
          <p className="text-xl font-extrabold">Бөлім табылмады</p>
          <div className="mt-4">
            <DuoButton onClick={() => router.push("/eurasia")}>Еуразияға</DuoButton>
          </div>
        </div>
      )}
    </AppShell>
  );
}
