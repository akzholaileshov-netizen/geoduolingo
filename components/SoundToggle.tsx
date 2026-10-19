"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSyncExternalStore } from "react";
import { setSoundEnabled, soundEnabled, subscribeSound, unlockAudio } from "@/lib/audio";

export function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, soundEnabled, () => true);

  return (
    <button
      type="button"
      data-testid="sound-toggle"
      aria-pressed={on}
      aria-label={on ? "Дыбыс қосулы" : "Дыбыс өшірулі"}
      onClick={() => {
        unlockAudio();
        setSoundEnabled(!on);
      }}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#1cb0f6]"
    >
      {on ? <Volume2 size={22} /> : <VolumeX size={22} />}
    </button>
  );
}
