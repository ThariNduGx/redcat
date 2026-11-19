import { HUB_MAP_HREF } from "@/lib/site";
import Mascot from "@/components/ui/Mascot";
import ArrowLink from "@/components/ui/ArrowLink";

export default function NotFound() {
  return (
    <section className="rc-grain relative grid min-h-[75vh] place-items-center overflow-clip bg-brand px-5 py-20 text-center text-white">
      <div className="relative">
        <Mascot className="mx-auto w-56 [&_svg]:h-auto [&_svg]:w-full" />
        <div className="relative -mt-1 rounded-[2rem] border-[3px] border-ink bg-white px-8 py-10 text-ink shadow-2xl sm:px-14">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Error 404</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">This page took a wrong turn.</h1>
          <p className="mx-auto mt-3 max-w-sm text-lg text-ink/70">Even our cat can&rsquo;t find it. Let&rsquo;s get you back on the route.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ArrowLink href="/">Go home</ArrowLink>
            <ArrowLink href={HUB_MAP_HREF} variant="brand">Explore the network</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
