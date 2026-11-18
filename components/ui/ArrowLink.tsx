import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";

const variants = {
  dark: "bg-ink text-white hover:bg-brand-deep",
  light: "bg-white text-ink hover:bg-ink hover:text-white",
  outline: "border-2 border-current hover:bg-white hover:text-ink",
  brand: "bg-brand text-white hover:bg-ink hover:text-white",
} as const;

/** Pill link with an arrow that slides on hover and a small press-in on click. */
export default function ArrowLink({
  variant = "dark",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof variants }) {
  return (
    <Link
      {...props}
      className={`press group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-bold transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
      <span className="relative inline-block h-[18px] w-[18px] overflow-hidden" aria-hidden>
        <ArrowRight size={18} strokeWidth={2.5} className="absolute inset-0 transition-transform duration-300 ease-out group-hover:translate-x-full" />
        <ArrowRight size={18} strokeWidth={2.5} className="absolute inset-0 -translate-x-full transition-transform duration-300 ease-out group-hover:translate-x-0" />
      </span>
    </Link>
  );
}
