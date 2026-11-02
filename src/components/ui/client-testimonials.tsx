import { useEffect, useState } from "react";

const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";

export default function ClientTestimonials() {
  const [startingPrice, setStartingPrice] = useState("R5,000");

  useEffect(() => {
    const controller = new AbortController();
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    fetch(`/api/localisation?timeZone=${encodeURIComponent(browserTimeZone)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Localisation unavailable");
        return await response.json() as { price?: { formatted?: string } };
      })
      .then((result) => {
        if (result.price?.formatted) setStartingPrice(result.price.formatted);
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  return (
    <section id="clients" className="overflow-visible border-t border-slate-200 bg-white py-20 md:pb-16 md:pt-28" aria-labelledby="clients-heading">
      <div className="relative mx-auto grid max-w-6xl grid-cols-[64px_1fr] gap-6 px-5 md:grid-cols-[96px_1fr] md:gap-12 md:px-8">
        <aside className="flex justify-center border-r border-slate-200 pr-4 md:h-[300px] md:overflow-visible md:pr-7">
          <p className="rotate-180 text-[64px] font-black italic leading-none text-blue-600 [writing-mode:vertical-rl] md:translate-y-[70px] md:text-[80px]" style={{ fontFamily: sectionFont }}>
            KERVOX VERSIONS
          </p>
        </aside>

        <div className="relative py-5 md:py-10">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-9 flex items-center gap-4">
              <span className="h-px w-10 bg-blue-600" />
              <span className="text-xl font-black italic uppercase text-blue-600" style={{ fontFamily: sectionFont }}>FLEXIBILITY TO GROW</span>
            </div>
            <h2 id="clients-heading" className="text-3xl font-medium leading-tight text-slate-950 md:text-5xl">
              One Platform. Three Ways to Operate.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
              Choose the Kervox version that fits your business today, with the flexibility to grow tomorrow.
            </p>
            <p className="mt-6 text-sm font-bold uppercase tracking-[.12em] text-blue-700">Plans starting from {startingPrice}/month.</p>
            <div className="mt-10 h-px w-full bg-slate-200" />
            <a href="https://kervox.cloud" className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              Explore Plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
