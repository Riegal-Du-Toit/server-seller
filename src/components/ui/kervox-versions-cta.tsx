import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import AnimatedUnderlineText from "@/components/AnimatedUnderlineText";

const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";
const versions = [
  { number: "01", name: "Essentials", description: "Membership foundation" },
  { number: "02", name: "Care Network", description: "Claims and providers" },
  { number: "03", name: "Enterprise", description: "Complete operations" },
];

export default function KervoxVersionsCta() {
  const [startingPrice, setStartingPrice] = useState("R5,000");

  useEffect(() => {
    const controller = new AbortController();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch(`/api/localisation?timeZone=${encodeURIComponent(timeZone)}`, { signal: controller.signal })
      .then(async (response) => response.ok ? await response.json() as { price?: { formatted?: string } } : undefined)
      .then((result) => { if (result?.price?.formatted) setStartingPrice(result.price.formatted); })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  return <section id="contact" className="overflow-visible border-t border-slate-200 bg-white py-20 md:pb-16 md:pt-[82px]" aria-labelledby="versions-heading">
    <div className="relative mx-auto grid max-w-6xl grid-cols-[64px_1fr] gap-6 px-5 md:grid-cols-[96px_1fr] md:gap-12 md:px-8">
      <aside className="flex justify-center border-r border-slate-200 pr-4 md:h-[300px] md:overflow-visible md:pr-7"><p className="rotate-180 text-[64px] font-black italic leading-none text-blue-600 [writing-mode:vertical-rl] md:translate-y-[200px] md:text-[80px]" style={{ fontFamily: sectionFont }}><span className="relative top-[6px]">KERVOX</span> VERSIONS</p></aside>
      <div className="relative py-5 md:py-10"><div className="relative z-10 max-w-3xl"><div className="mb-9 flex items-center gap-4"><span className="h-px w-10 bg-blue-600" /><span className="text-xl font-black italic uppercase text-blue-600" style={{ fontFamily: sectionFont }}>FLEXIBILITY TO GROW</span></div><h2 id="versions-heading" className="text-3xl font-medium leading-tight text-slate-950 md:text-5xl"><AnimatedUnderlineText text="One Platform." className="text-blue-600" /> <span>Three Ways to Operate.</span></h2><p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">Choose the Kervox version that fits your business today, with the flexibility to grow tomorrow.</p><p className="mt-6 text-sm font-bold uppercase tracking-[.12em] text-blue-700">Plans starting from {startingPrice}/month.</p><div className="mt-8 grid gap-3 sm:grid-cols-3">{versions.map((version) => <div key={version.number} className="border-l-2 border-blue-200 pl-3"><p className="text-xs font-bold tracking-[.12em] text-blue-700">{version.number}</p><p className="mt-1 font-bold text-slate-950">{version.name}</p><p className="mt-1 text-sm text-slate-600">{version.description}</p></div>)}</div><div className="mt-10 h-px w-full bg-slate-200" /><div className="mt-8 flex flex-wrap gap-3"><a href="https://www.kervox.dev/packages" className="inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">View 3 options</a><a href="https://wa.me/27714329190?text=Hi%20Kervox%2C%20I%27d%20like%20to%20book%20a%20demo." target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1da851]"><MessageCircle className="size-4" />Book a Demo on WhatsApp</a></div></div></div>
    </div>
  </section>;
}
