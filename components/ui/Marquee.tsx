import type { ReactNode } from "react";

/** An endless horizontal ticker. Pauses on hover and stops for reduced motion. */
export default function Marquee({ children, speed = 60, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  return (
    <div className={`rc-marquee group flex overflow-hidden ${className}`}>
      {[0, 1].map((i) => (
        <div
          key={i}
          aria-hidden={i === 1}
          className="rc-marquee-track flex shrink-0 items-center group-hover:[animation-play-state:paused]"
          style={{ animationDuration: `${speed}s` }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
