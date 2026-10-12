import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerCta() {
  return (
    <section id="contact" className="border-y border-slate-200 bg-white px-5 py-20 md:px-8 md:py-24" aria-labelledby="cta-heading">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-700">Ready when you are</span>
          <h2 id="cta-heading" className="mt-4 text-3xl font-semibold tracking-normal text-slate-950 md:text-5xl">
            Start with infrastructure that can keep up.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Talk to our team about a server built around your workload and growth plans.
          </p>
        </div>
        <Button asChild size="lg" className="bg-sky-600 text-white hover:bg-sky-700">
          <a href="mailto:sales@example.com">Talk to sales <ArrowRight className="h-4 w-4" /></a>
        </Button>
      </div>
    </section>
  );
}
