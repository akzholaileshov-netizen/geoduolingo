"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DuoButton } from "@/components/DuoButton";
import { isSupabaseConfigured } from "@/lib/supabaseClient";
import { useAppStore } from "@/store/useAppStore";

type Props = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: Props) {
  const profile = useAppStore((state) => state.profile);
  const login = useAppStore((state) => state.login);
  const signup = useAppStore((state) => state.signup);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (profile) router.replace("/");
  }, [profile, router]);

  if (profile) return null;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    const result =
      mode === "login" ? await login(email, password) : await signup(email, password, displayName);
    setPending(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.replace("/");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border-2 border-[#e5e5e5] bg-white p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#58cc02] text-white">
            <MapPin size={32} />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-[#3c3c3c]">GeoDuolingo</h1>
          <p className="mt-1 font-bold text-[#777]">
            {mode === "login" ? "Қайта оралғаныңа қуаныштымыз" : "Географияны картамен жатта"}
          </p>
        </div>
        {mode === "signup" ? (
          <p className="mb-4 rounded-2xl bg-[#e8f8d8] px-4 py-3 text-sm font-bold text-[#3c3c3c]">
            {isSupabaseConfigured
              ? "Аккаунт Supabase арқылы ашылады."
              : "Демо режим: кез келген пошта мен құпия сөз жарайды. Прогресс осы құрылғыда сақталады."}
          </p>
        ) : null}
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" ? (
            <label className="block text-sm font-extrabold text-[#3c3c3c]">
              Аты-жөні
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Ақжол"
                autoComplete="name"
                className="mt-1 w-full rounded-2xl border-2 border-[#e5e5e5] px-4 py-3 text-base font-bold outline-none focus:border-[#84d8ff]"
              />
            </label>
          ) : null}
          <label className="block text-sm font-extrabold text-[#3c3c3c]">
            Электрондық пошта
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              data-testid="email"
              className="mt-1 w-full rounded-2xl border-2 border-[#e5e5e5] px-4 py-3 text-base font-bold outline-none focus:border-[#84d8ff]"
            />
          </label>
          <label className="block text-sm font-extrabold text-[#3c3c3c]">
            Құпия сөз
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              data-testid="password"
              className="mt-1 w-full rounded-2xl border-2 border-[#e5e5e5] px-4 py-3 text-base font-bold outline-none focus:border-[#84d8ff]"
            />
          </label>
          {error ? <p className="text-sm font-bold text-[#ff4b4b]">{error}</p> : null}
          <DuoButton type="submit" disabled={pending} data-testid="auth-submit">
            {pending ? "Күте тұр..." : mode === "login" ? "Кіру" : "Тіркелу"}
          </DuoButton>
        </form>
        <p className="mt-5 text-center text-sm font-bold text-[#777]">
          {mode === "login" ? (
            <>
              Аккаунтың жоқ па?{" "}
              <Link href="/signup" className="text-[#1cb0f6]">
                Тіркелу
              </Link>
            </>
          ) : (
            <>
              Аккаунтың бар ма?{" "}
              <Link href="/login" className="text-[#1cb0f6]">
                Кіру
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
