import Mascot from "./ui/Mascot";

export function Logo({ className = "h-12 w-auto" }: { className?: string }) {
  return (
    <div role="img" aria-label="RedCat Next Day Delivery" className={`inline-block aspect-[488/358] ${className}`}>
      <Mascot variant="logo" className="h-full w-full [&_svg]:h-full [&_svg]:w-full" />
    </div>
  );
}
