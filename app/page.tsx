"use client";

import { AppShell } from "@/components/AppShell";
import { FlagAvatar } from "@/components/FlagAvatar";
import { SkillTree } from "@/components/SkillTree";
import { levelFromXp, xpIntoLevel } from "@/lib/progress";
import { useAppStore } from "@/store/useAppStore";

export default function HomePage() {
  const profile = useAppStore((state) => state.profile);
  const level = levelFromXp(profile?.xp ?? 0);
  const into = xpIntoLevel(profile?.xp ?? 0);

  return (
    <AppShell>
      <section className="mb-5 rounded-[28px] border-2 border-[#e5e5e5] bg-white p-5" data-testid="home-greeting">
        <div className="flex items-center gap-3">
          {profile?.avatarFlag ? (
            <span data-testid="home-avatar">
              <FlagAvatar code={profile.avatarFlag} size={56} />
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-[#1cb0f6]">Сәлем</p>
            <h1 className="truncate text-2xl font-extrabold text-[#3c3c3c]">{profile?.displayName}</h1>
          </div>
        </div>
        <p className="mt-1 text-sm font-bold text-[#777]">Дағдылар жолы — нысанды картадан тап</p>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-sm font-extrabold">
            <span>Деңгей {level}</span>
            <span>
              {into}/100 XP
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-[#e5e5e5]">
            <div className="h-full rounded-full bg-[#58cc02]" style={{ width: `${into}%` }} />
          </div>
        </div>
      </section>
      <SkillTree />
    </AppShell>
  );
}
