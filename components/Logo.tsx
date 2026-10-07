import Image from "next/image";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <Image
      src="/brand/logo.svg"
      alt="RedCat Next Day Delivery"
      width={488}
      height={358}
      unoptimized
      priority
      className={className}
    />
  );
}
