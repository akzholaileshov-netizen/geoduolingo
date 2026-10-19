"use client";

import "flag-icons/css/flag-icons.min.css";
import { isFlagCode } from "@/lib/flags";

export function FlagAvatar({ code, size = 40 }: { code: string; size?: number }) {
  if (!isFlagCode(code)) return null;
  return (
    <span
      className={`fi fi-${code} fis shrink-0 border border-[#e5e5e5]`}
      data-flag={code}
      role="img"
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size, backgroundSize: "cover", borderRadius: 10 }}
    />
  );
}
