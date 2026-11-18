import type { Metadata } from "next";
import { Suspense } from "react";
import NetworkPageMap from "@/components/NetworkPageMap";
import Reveal from "@/components/Reveal";
import CatLoader from "@/components/ui/CatLoader";
import { ZONES, hubsInZone } from "@/data/hubs";

export const metadata: Metadata = {
  title: "Our Network",
  description: "Explore RedCat's 4 zones and 57 regional hubs on a live map of Sri Lanka, and find the hub nearest to you.",
};

export default function NetworkPage() {
  return (
    <>
      <section className="bg-paper pb-16 pt-10 sm:pb-24 sm:pt-14">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-deep">Our network</p>
              <h1 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-7xl">Every district. Next day.</h1>
            </div>
            <p className="max-w-md text-lg text-ink/70">
              57 regional hubs in 4 zones feed 930+ express points, all connected through our overnight delivery network.
            </p>
          </div>
          <div className="mt-10">
            <Suspense fallback={<div className="grid h-[62vh] min-h-[420px] place-items-center rounded-[1.75rem] border border-black/10 lg:h-[680px]"><CatLoader label="Fetching the island…" /></div>}>
              <NetworkPageMap />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <Reveal>
          <h2 className="text-4xl font-extrabold tracking-[-0.03em] sm:text-5xl">All regional hubs</h2>
          <p className="mt-3 max-w-2xl text-lg text-ink/70">The distance is how far each hub is from the center of its zone.</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ZONES.map((z, i) => (
            <Reveal key={z.id} delay={(i % 2) * 100} className="overflow-hidden rounded-[2rem] border border-black/10 bg-white">
              <div className="flex items-center justify-between gap-4 p-6" style={{ background: `${z.color}1f` }}>
                <h3 className="text-2xl font-extrabold tracking-tight">
                  {z.name} <span className="font-medium text-ink/70">· {z.center}</span>
                </h3>
                <span className="rounded-full px-3 py-1 text-sm font-extrabold text-white" style={{ background: z.color }}>
                  {hubsInZone(z.id).length} hubs
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[22rem] text-left text-[15px]">
                  <caption className="sr-only">Regional hubs in {z.name}, {z.center}</caption>
                  <thead>
                    <tr className="border-b border-black/10 text-sm text-ink/55">
                      <th scope="col" className="px-6 py-3 font-semibold">Hub</th>
                      <th scope="col" className="px-3 py-3 font-semibold">District</th>
                      <th scope="col" className="px-3 py-3 font-semibold">ID</th>
                      <th scope="col" className="px-6 py-3 text-right font-semibold">To zone</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hubsInZone(z.id).map((h) => (
                      <tr key={h.id} className="border-b border-black/5 transition-colors last:border-0 hover:bg-mist">
                        <th scope="row" className="px-6 py-3 font-bold">
                          <a href={`/network?hub=${h.id}`} className="hover:underline">{h.name}</a>
                        </th>
                        <td className="px-3 py-3 text-ink/70">{h.district}</td>
                        <td className="px-3 py-3 text-ink/55">{h.id}</td>
                        <td className="px-6 py-3 text-right font-semibold tabular-nums">{h.km} km</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
