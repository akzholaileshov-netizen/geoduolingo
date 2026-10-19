"use client";

import { X } from "lucide-react";
import { useEffect } from "react";
import { FlagAvatar } from "@/components/FlagAvatar";
import { flagOptions } from "@/lib/flags";

export function AvatarPicker({
  open,
  selected,
  onClose,
  onPick,
}: {
  open: boolean;
  selected: string | null;
  onClose: () => void;
  onPick: (code: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-3 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Туды таңда"
        data-testid="avatar-modal"
        className="flex max-h-[80dvh] w-full max-w-lg flex-col rounded-[28px] bg-white p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">Туды таңда</h2>
          <button type="button" aria-label="Жабу" onClick={onClose} className="text-[#afafaf]">
            <X size={26} />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2 overflow-y-auto pb-2">
          {flagOptions.map((flag) => {
            const active = flag.code === selected;
            return (
              <button
                key={flag.code}
                type="button"
                data-testid={`flag-${flag.code}`}
                aria-label={flag.nameKk}
                aria-pressed={active}
                onClick={() => onPick(flag.code)}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 px-1 py-2 ${
                  active ? "border-[#58cc02] bg-[#e8f8d8]" : "border-[#e5e5e5] bg-white"
                }`}
              >
                <FlagAvatar code={flag.code} size={42} />
                <span className="line-clamp-2 text-center text-[10px] font-extrabold leading-tight text-[#3c3c3c]">
                  {flag.nameKk}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
