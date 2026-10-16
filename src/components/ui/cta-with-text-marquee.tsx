import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const marqueeItems = ["CAMPAIGN", "FUNNEL", "APPLICATION", "CRM", "DATABASE"];
const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";

function VerticalMarquee() {
  return (
    <div className="relative h-[360px] overflow-hidden border-x border-slate-200 bg-slate-50 md:h-full md:min-h-[560px]" aria-hidden="true">
      <div className="cta-marquee absolute left-0 top-0 flex w-full flex-col items-center gap-6 py-6">
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span key={`${item}-${index}`} className="whitespace-nowrap text-4xl font-black italic text-blue-600/20 md:text-5xl" style={{ fontFamily: sectionFont }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CtaWithTextMarquee() {
  return (
    <section id="contact" className="border-y border-slate-200 bg-white" aria-labelledby="cta-heading">
      <div className="mx-auto grid max-w-6xl md:min-h-[560px] md:grid-cols-[1.1fr_0.9fr]">
        <div className="flex flex-col justify-center px-5 py-20 md:px-12 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Your next stage starts here</p>
          <h2 id="cta-heading" className="mt-5 max-w-xl text-4xl font-black italic leading-[0.95] text-blue-600 md:text-6xl" style={{ fontFamily: sectionFont }}>
            One Platform. Bigger Possibilities.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 md:text-lg">
            Whether you're replacing manual processes, connecting existing systems or building a digital operation from the ground up, Kervox gives you a foundation to build on.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
              <a href="mailto:sales@example.com?subject=Kervox%20Demo">Book a Demo <ArrowRight className="h-4 w-4" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <a href="mailto:sales@example.com">Talk to Our Team</a>
            </Button>
          </div>
        </div>
        <VerticalMarquee />
      </div>
    </section>
  );
}
