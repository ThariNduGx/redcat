"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const EVENT = "rc:toast";

/** Show a short message at the bottom of the screen. Safe to call from anywhere on the client. */
export function toast(message: string) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent(EVENT, { detail: message }));
}

export default function Toaster() {
  const [items, setItems] = useState<{ id: number; message: string }[]>([]);

  useEffect(() => {
    let n = 0;
    const onToast = (e: Event) => {
      const id = ++n;
      const message = (e as CustomEvent<string>).detail;
      setItems((xs) => [...xs.slice(-2), { id, message }]);
      setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 3200);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="max-w-md rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/30"
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
