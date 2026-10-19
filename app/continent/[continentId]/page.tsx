"use client";

import { ChevronLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { LessonPath } from "@/components/LessonPath";
import { DuoButton } from "@/components/DuoButton";
import { findContinent } from "@/lib/curriculum";

export default function ContinentPage() {
  const params = useParams<{ continentId: string }>();
  const router = useRouter();
  const continent = findContinent(params.continentId);

  return (
    <AppShell>
      <button
        type="button"
        onClick={() => router.push("/eurasia")}
        className="mb-4 inline-flex items-center gap-1 text-sm font-extrabold text-[#1cb0f6]"
      >
        <ChevronLeft size={18} /> Еуразия
      </button>
      {continent ? (
        <section className="rounded-[28px] border-2 border-[#e5e5e5] bg-white px-3 py-5">
          <div className="px-3">
            <h1 className="text-2xl font-extrabold text-[#3c3c3c]" data-testid="continent-title">
              {continent.emoji} {continent.titleKk}
            </h1>
            <p className="mt-1 text-sm font-bold text-[#777]">{continent.descriptionKk}</p>
          </div>
          <div className="mt-4">
            <LessonPath lessonIds={continent.lessonIds} />
          </div>
        </section>
      ) : (
        <div className="rounded-[28px] border-2 border-[#e5e5e5] bg-white p-6 text-center">
          <p className="text-xl font-extrabold">Құрлық табылмады</p>
          <div className="mt-4">
            <DuoButton onClick={() => router.push("/eurasia")}>Еуразияға</DuoButton>
          </div>
        </div>
      )}
    </AppShell>
  );
}
