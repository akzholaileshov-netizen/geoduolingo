import type { ButtonHTMLAttributes } from "react";

const variants = {
  green: "bg-[#58cc02] text-white border-[#46a302]",
  blue: "bg-[#1cb0f6] text-white border-[#1899d6]",
  white: "bg-white text-[#46a302] border-[#d4d4d4]",
  ghost: "bg-transparent text-[#1cb0f6] border-transparent",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function DuoButton({ variant = "green", className = "", type = "button", ...props }: Props) {
  return (
    <button
      type={type}
      className={`w-full rounded-2xl border-b-4 px-4 py-3 text-center text-sm font-extrabold uppercase tracking-wide transition active:translate-y-0.5 active:border-b-0 disabled:cursor-not-allowed disabled:border-[#e5e5e5] disabled:bg-[#e5e5e5] disabled:text-[#afafaf] ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
