import { getSupabase } from "@/lib/supabaseClient";

export type BoardEntry = {
  id: string;
  displayName: string;
  xp: number;
  seeded: boolean;
};

export const RIVALS: BoardEntry[] = [
  { id: "rival-aigerim", displayName: "Айгерім", xp: 2480, seeded: true },
  { id: "rival-nursultan", displayName: "Нұрсұлтан", xp: 1910, seeded: true },
  { id: "rival-dana", displayName: "Дана", xp: 1340, seeded: true },
  { id: "rival-yerasyl", displayName: "Ерасыл", xp: 860, seeded: true },
  { id: "rival-madina", displayName: "Мадина", xp: 30, seeded: true },
];

export function buildLeaderboard(user: BoardEntry, extra: BoardEntry[] = []) {
  const byId = new Map<string, BoardEntry>();
  for (const row of [...RIVALS, ...extra, user]) {
    const existing = byId.get(row.id);
    if (!existing || row.xp >= existing.xp) byId.set(row.id, row);
  }
  return [...byId.values()].sort(
    (a, b) => b.xp - a.xp || a.displayName.localeCompare(b.displayName, "kk"),
  );
}

export async function fetchRemoteLeaderboard(): Promise<BoardEntry[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from("leaderboard").select("id, display_name, xp").limit(30);
  if (error || !Array.isArray(data)) return [];
  const rows: BoardEntry[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const xp = typeof row.xp === "number" ? row.xp : Number(row.xp);
    if (typeof row.id !== "string" || typeof row.display_name !== "string" || !Number.isFinite(xp)) continue;
    rows.push({ id: row.id, displayName: row.display_name, xp, seeded: false });
  }
  return rows;
}
