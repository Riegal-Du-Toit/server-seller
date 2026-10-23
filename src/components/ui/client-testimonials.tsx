import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const testimonials = [
  { quote: "It’s the best piece of work I’ve seen on a brand transformation — we were blown away.", author: "Customer feedback", role: "Shared after a Kervox brand transformation", category: "Current Clients" },
  { quote: "The thinking, quality and attention to detail have taken the whole brand to another level.", author: "Customer feedback", role: "Shared by a Kervox customer", category: "Current Clients" },
  { quote: "This has given us clarity, confidence and a platform our team is proud to put in front of customers.", author: "Customer feedback", role: "Shared by a Kervox customer", category: "Current Clients" },
  { quote: "The result feels considered from every angle — sharper, stronger and built to grow with us.", author: "Customer feedback", role: "Shared by a Kervox customer", category: "Current Clients" },
  { quote: "You took a complex vision and turned it into something simple, powerful and ready to perform.", author: "Customer feedback", role: "Shared by a Kervox customer", category: "Current Clients" },
];

const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";

export default function ClientTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const goNext = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const goPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  const current = testimonials[activeIndex];

  return (
    <section id="clients" className="overflow-visible border-t border-slate-200 bg-white py-20 md:pb-16 md:pt-28" aria-labelledby="clients-heading">
      <div className="relative mx-auto grid max-w-6xl grid-cols-[64px_1fr] gap-6 px-5 md:grid-cols-[96px_1fr] md:gap-12 md:px-8">
        <aside className="flex justify-center border-r border-slate-200 pr-4 md:h-[300px] md:overflow-visible md:pr-7">
          <p className="rotate-180 text-[64px] font-black italic leading-none text-blue-600 [writing-mode:vertical-rl] md:translate-y-[70px] md:text-[80px]" style={{ fontFamily: sectionFont }}>
            CURRENT CLIENTS
          </p>
        </aside>

        <div className="relative overflow-hidden py-5 md:py-10">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-9 flex items-center gap-4">
              <span className="h-px w-10 bg-blue-600" />
              <span className="text-xl font-black italic uppercase text-blue-600" style={{ fontFamily: sectionFont }}>
                {current.category}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote key={activeIndex} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }}>
                <p id="clients-heading" className="text-3xl font-medium leading-tight text-slate-950 md:text-5xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div key={activeIndex} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, delay: 0.1 }} className="flex items-center gap-4">
                  <span className="h-px w-9 bg-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-950">{current.author}</p>
                    <p className="mt-1 text-sm text-slate-500">{current.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {testimonials.length > 1 && <div className="flex items-center gap-3">
                <button type="button" onClick={goPrevious} aria-label="Previous customer quote" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={goNext} aria-label="Next customer quote" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>}
            </div>

            <div className="mt-10 h-px w-full bg-slate-200">
              <motion.div className="h-full bg-blue-600" animate={{ width: `${((activeIndex + 1) / testimonials.length) * 100}%` }} transition={{ duration: 0.45 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
