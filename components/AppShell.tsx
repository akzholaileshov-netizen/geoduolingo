"use client";

import { Flame, House, MapPin, Star, Trophy, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { SoundToggle } from "@/components/SoundToggle";
import { Splash } from "@/components/Providers";

const links = [
  { href: "/", label: "Басты", icon: House },
  { href: "/leaderboard", label: "Көшбасшылар", icon: Trophy },
  { href: "/profile", label: "Профиль", icon: UserRound },
];

export function useRequireProfile() {
  const profile = useAppStore((state) => state.profile);
  const ready = useAppStore((state) => state.ready);
  const router = useRouter();

  useEffect(() => {
    if (ready && !profile) router.replace("/login");
  }, [ready, profile, router]);

  return ready ? profile : null;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const profile = useRequireProfile();
  const pathname = usePathname();
  const saveError = useAppStore((state) => state.saveError);
  const clearSaveError = useAppStore((state) => state.clearSaveError);

  if (!profile) return <Splash />;

  return (
    <div className="min-h-dvh pb-24">
      <header className="sticky top-0 z-20 border-b-2 border-[#e5e5e5] bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-[#58cc02]">
            <MapPin size={26} />
            <span className="text-lg font-extrabold text-[#3c3c3c]">GeoLingo</span>
          </Link>
          <div className="flex items-center gap-3 font-extrabold">
            <span className="flex items-center gap-1 text-[#ff9600]" data-testid="header-streak">
              <Flame size={18} fill="#ff9600" />
              {profile.streak}
            </span>
            <span className="flex items-center gap-1 text-[#ffc800]" data-testid="header-xp">
              <Star size={18} fill="#ffc800" />
              {profile.xp}
            </span>
            <SoundToggle />
          </div>
        </div>
        {saveError ? (
          <button
            type="button"
            onClick={clearSaveError}
            className="block w-full bg-[#ffecec] px-4 py-2 text-center text-sm font-bold text-[#ea2b2b]"
          >
            {saveError}
          </button>
        ) : null}
      </header>
      <main className="mx-auto w-full max-w-lg px-4 py-5">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-[#e5e5e5] bg-white">
        <div className="mx-auto grid w-full max-w-lg grid-cols-3">
          {links.map((link) => {
            const active = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-1 py-2 text-xs font-extrabold ${active ? "text-[#58cc02]" : "text-[#afafaf]"}`}
              >
                <Icon size={22} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
