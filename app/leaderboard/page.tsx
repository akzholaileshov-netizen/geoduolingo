"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { FlagAvatar } from "@/components/FlagAvatar";
import { isFlagCode } from "@/lib/flags";
import { buildLeaderboard, fetchRemoteLeaderboard, type BoardEntry } from "@/lib/leaderboard";
import { useAppStore } from "@/store/useAppStore";

export default function LeaderboardPage() {
  const profile = useAppStore((state) => state.profile);
  const [extra, setExtra] = useState<BoardEntry[]>([]);

  useEffect(() => {
    let alive = true;
    void fetchRemoteLeaderboard()
      .then((rows) => {
        if (alive) setExtra(rows);
      })
      .catch(() => {
        if (alive) setExtra([]);
      });
    return () => {
      alive = false;
    };
  }, []);

  const rows = profile
    ? buildLeaderboard(
        {
          id: profile.id,
          displayName: profile.displayName,
          xp: profile.xp,
          seeded: false,
          avatarFlag: profile.avatarFlag,
        },
        extra,
      )
    : [];

  return (
    <AppShell>
      <h1 className="mb-4 text-2xl font-extrabold">Көшбасшылар</h1>
      <ol className="space-y-3">
        {rows.map((row, index) => {
          const mine = row.id === profile?.id;
          return (
            <li
              key={row.id}
              data-testid={mine ? "leaderboard-me" : undefined}
              className={`flex items-center gap-3 rounded-3xl border-2 px-4 py-3 ${
                mine ? "border-[#58cc02] bg-[#e8f8d8]" : "border-[#e5e5e5] bg-white"
              }`}
            >
              <span
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-extrabold ${
                  index === 0
                    ? "bg-[#ffc800] text-[#3c3c3c]"
                    : index === 1
                      ? "bg-[#e5e5e5] text-[#3c3c3c]"
                      : index === 2
                        ? "bg-[#ffd0a8] text-[#3c3c3c]"
                        : "bg-[#f7f7f7] text-[#777]"
                }`}
              >
                {index + 1}
              </span>
              {isFlagCode(mine ? profile?.avatarFlag : row.avatarFlag) ? (
                <span data-testid={mine ? "leaderboard-avatar" : undefined}>
                  <FlagAvatar code={(mine ? profile?.avatarFlag : row.avatarFlag) as string} size={32} />
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold">
                  {row.displayName}
                  {mine ? " · сен" : ""}
                </p>
                <p className="text-xs font-bold text-[#afafaf]">{row.seeded ? "Үлгі ойыншы" : "Оқушы"}</p>
              </div>
              <p className="font-extrabold text-[#ffc800]">{row.xp} XP</p>
            </li>
          );
        })}
      </ol>
    </AppShell>
  );
}
