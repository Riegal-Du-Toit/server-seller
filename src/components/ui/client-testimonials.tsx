import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const testimonials = [
  { quote: "Our policy systems stayed responsive during the busiest renewal period we have ever handled.", author: "Operations Director", role: "Member Services", category: "Member Services" },
  { quote: "A more dependable platform gave our claims team the confidence to move faster every day.", author: "Technology Lead", role: "Claims Operations", category: "Claims Operations" },
  { quote: "We gained capacity without adding complexity for the people managing the platform.", author: "Infrastructure Manager", role: "Policy Administration", category: "Policy Administration" },
];

const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";

export default function ClientTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 200 });
  const numberX = useTransform(x, [-200, 200], [-20, 20]);
  const numberY = useTransform(y, [-200, 200], [-10, 10]);

  const goNext = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const goPrevious = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    const timer = window.setInterval(goNext, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const current = testimonials[activeIndex];

  return (
    <section id="clients" className="overflow-hidden border-t border-slate-200 bg-white py-20 md:py-28" aria-labelledby="clients-heading">
      <div ref={containerRef} className="relative mx-auto grid max-w-6xl grid-cols-[64px_1fr] gap-6 px-5 md:grid-cols-[96px_1fr] md:gap-12 md:px-8" onMouseMove={(event) => {
        const bounds = containerRef.current?.getBoundingClientRect();
        if (bounds) {
          mouseX.set(event.clientX - bounds.left - bounds.width / 2);
          mouseY.set(event.clientY - bounds.top - bounds.height / 2);
        }
      }}>
        <aside className="flex justify-center border-r border-slate-200 pr-4 md:pr-7">
          <p className="rotate-180 text-[64px] font-black italic leading-none text-blue-600 [writing-mode:vertical-rl] md:text-[80px]" style={{ fontFamily: sectionFont }}>
            CLIENTS
          </p>
        </aside>

        <div className="relative min-h-[440px] overflow-hidden py-5 md:min-h-[470px] md:py-10">
          <motion.p className="pointer-events-none absolute -left-7 top-1/2 -z-0 -translate-y-1/2 select-none text-[13rem] font-black italic leading-none text-blue-600/[0.06] md:text-[20rem]" style={{ x: numberX, y: numberY, fontFamily: sectionFont }}>
            {String(activeIndex + 1).padStart(2, "0")}
          </motion.p>

          <div className="relative z-10 max-w-3xl">
            <div className="mb-9 flex items-center gap-4">
              <span className="h-px w-10 bg-blue-600" />
              <span className="text-xl font-black italic uppercase text-blue-600" style={{ fontFamily: sectionFont }}>
                {current.category}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.blockquote key={activeIndex} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.45 }}>
                <p id="clients-heading" className="text-3xl font-medium leading-tight text-slate-950 md:text-5xl">
                  &ldquo;{current.quote}&rdquo;
                </p>
              </motion.blockquote>
            </AnimatePresence>

            <div className="mt-12 flex flex-wrap items-end justify-between gap-8">
              <AnimatePresence mode="wait">
                <motion.div key={activeIndex} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, delay: 0.1 }} className="flex items-center gap-4">
                  <span className="h-px w-9 bg-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-950">{current.author}</p>
                    <p className="mt-1 text-sm text-slate-500">{current.role}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-3">
                <button type="button" onClick={goPrevious} aria-label="Previous testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button type="button" onClick={goNext} aria-label="Next testimonial" className="grid h-11 w-11 place-items-center rounded-full border border-slate-300 text-slate-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
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
