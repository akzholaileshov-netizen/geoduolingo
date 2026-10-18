"use client";

import { Check, Flame, LogOut, Star } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { DuoButton } from "@/components/DuoButton";
import { modules } from "@/lib/curriculum";
import { isModuleFinished, levelFromXp } from "@/lib/progress";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAppStore } from "@/store/useAppStore";

export default function ProfilePage() {
  const profile = useAppStore((state) => state.profile);
  const logout = useAppStore((state) => state.logout);
  const level = levelFromXp(profile?.xp ?? 0);
  const finished = modules.filter((module) => isModuleFinished(module.id, profile?.completedLessonIds ?? []));

  return (
    <AppShell>
      <section className="rounded-[28px] border-2 border-[#e5e5e5] bg-white p-5 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#58cc02] text-3xl font-extrabold text-white">
          {profile?.displayName.slice(0, 1).toUpperCase()}
        </div>
        <h1 className="mt-3 text-2xl font-extrabold">{profile?.displayName}</h1>
        <p className="text-sm font-bold text-[#777]">{profile?.email}</p>
        <p className="mt-2 text-sm font-extrabold text-[#1cb0f6]">Деңгей {level}</p>
        <p className="mt-1 text-xs font-bold text-[#afafaf]">
          {isSupabaseConfigured ? "Supabase аккаунты" : "Демо режим"}
        </p>
      </section>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <Stat label="XP" value={profile?.xp ?? 0} icon={<Star size={18} fill="#ffc800" className="text-[#ffc800]" />} testId="profile-xp" />
        <Stat
          label="Серия"
          value={profile?.streak ?? 0}
          icon={<Flame size={18} fill="#ff9600" className="text-[#ff9600]" />}
          testId="profile-streak"
        />
        <Stat label="Модуль" value={finished.length} icon={<Check size={18} className="text-[#58cc02]" />} testId="profile-modules" />
      </div>
      <section className="mt-4 rounded-[28px] border-2 border-[#e5e5e5] bg-white p-5">
        <h2 className="text-lg font-extrabold">Аяқталған модульдер</h2>
        <ul className="mt-3 space-y-3">
          {modules.map((module) => {
            const count = module.lessonIds.filter((id) => profile?.completedLessonIds.includes(id)).length;
            const complete = count === module.lessonIds.length;
            return (
              <li key={module.id} className="flex items-center justify-between gap-3">
                <span className="font-bold">
                  {module.emoji} {module.titleKk}
                </span>
                <span className={`shrink-0 text-sm font-extrabold ${complete ? "text-[#58cc02]" : "text-[#afafaf]"}`}>
                  {complete ? "Аяқталды" : `${count}/${module.lessonIds.length}`}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      <div className="mt-4">
        <DuoButton variant="white" onClick={() => void logout()}>
          <span className="inline-flex items-center justify-center gap-2">
            <LogOut size={18} /> Шығу
          </span>
        </DuoButton>
      </div>
    </AppShell>
  );
}

function Stat({
  label,
  value,
  icon,
  testId,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  testId: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-[#e5e5e5] bg-white px-2 py-4 text-center" data-testid={testId}>
      <div className="flex items-center justify-center gap-1 font-extrabold">
        {icon}
        <span className="text-xl">{value}</span>
      </div>
      <p className="mt-1 text-xs font-extrabold text-[#777]">{label}</p>
    </div>
  );
}
