"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { continents } from "@/lib/curriculum";

export default function EurasiaPage() {
  const router = useRouter();

  return (
    <AppShell>
      <button
        type="button"
        onClick={() => router.push("/")}
        className="mb-4 inline-flex items-center gap-1 text-sm font-extrabold text-[#1cb0f6]"
      >
        <ChevronLeft size={18} /> Басты бет
      </button>
      <section className="mb-5 rounded-[28px] border-2 border-[#e5e5e5] bg-white p-5">
        <h1 className="text-2xl font-extrabold text-[#3c3c3c]">Еуразия</h1>
        <p className="mt-1 text-sm font-bold text-[#777]">Құрлықты таңда</p>
      </section>
      <div className="grid gap-3">
        {continents.map((continent) => (
          <button
            key={continent.id}
            type="button"
            data-testid={`continent-${continent.id}`}
            onClick={() => router.push(`/continent/${continent.id}`)}
            className="flex items-center gap-3 rounded-[28px] border-2 border-[#e5e5e5] border-b-4 bg-white px-4 py-4 text-left"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f4fbf0] text-3xl">{continent.emoji}</span>
            <span>
              <span className="block text-xl font-extrabold text-[#3c3c3c]">{continent.titleKk}</span>
              <span className="mt-1 block text-sm font-bold text-[#777]">{continent.descriptionKk}</span>
            </span>
          </button>
        ))}
      </div>
    </AppShell>
  );
}
