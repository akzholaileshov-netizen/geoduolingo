"use client";

import { MapPin } from "lucide-react";
import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export function Splash() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#58cc02] text-white">
      <div className="text-center">
        <MapPin className="mx-auto" size={52} />
        <p className="mt-2 text-3xl font-extrabold">GeoDuolingo</p>
      </div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const hydrate = useAppStore((state) => state.hydrate);
  const ready = useAppStore((state) => state.ready);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  return (
    <>
      {children}
      {ready ? null : (
        <div className="fixed inset-0 z-50" data-testid="app-splash">
          <Splash />
        </div>
      )}
    </>
  );
}
