import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NotchedProjectCard } from "@/components/ui/notched-project-card";
import AnimatedUnderlineText from "@/components/AnimatedUnderlineText";

const cards = [
  { title: "Marketing", description: "Launch targeted campaigns, capture interest and connect your marketing directly to your sales pipeline.", image: "/section-images/marketing.png" },
  { title: "Funnels", description: "Create guided digital experiences that move customers from interest to action, without unnecessary steps or complicated processes.", image: "/section-images/funnel.png" },
  { title: "Applications", description: "Replace complicated paperwork and disconnected forms with structured digital applications designed for a smoother customer experience.", image: "/section-images/application.png" },
  { title: "Management", description: "Give your teams one place to manage customer relationships, applications, follow-ups and ongoing service.", image: "/section-images/management.png" },
  { title: "Database & Finance", description: "Bring customer information, operational records and business workflows together through a centralised data foundation.", image: "/section-images/database.png" },
];

export default function HeroScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);
  const canSkipHeroOnReturn = useRef(false);
  const [progress, setProgress] = useState(0);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const range = section.offsetHeight - window.innerHeight;
      setProgress(Math.min(1, Math.max(0, -section.getBoundingClientRect().top / range)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    if (activeCard !== cards.length - 1) return;

    const continueToPlatform = (event: WheelEvent) => {
      if (event.deltaY <= 0) return;
      const section = sectionRef.current;
      if (!section) return;
      const bounds = section.getBoundingClientRect();
      const heroIsPinned = bounds.top <= 0 && bounds.bottom > window.innerHeight;
      if (!heroIsPinned) return;

      event.preventDefault();
      window.scrollTo({ top: section.offsetTop + section.offsetHeight, behavior: "smooth" });
    };

    window.addEventListener("wheel", continueToPlatform, { passive: false });
    return () => window.removeEventListener("wheel", continueToPlatform);
  }, [activeCard]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    const skipLongHeroOnReturn = () => {
      const section = sectionRef.current;
      if (!section) return;

      const currentScrollY = window.scrollY;
      const heroBottom = section.offsetTop + section.offsetHeight;
      const wasScrollingUp = currentScrollY < lastScrollY.current;

      if (currentScrollY > heroBottom) canSkipHeroOnReturn.current = true;

      if (canSkipHeroOnReturn.current && wasScrollingUp && lastScrollY.current >= heroBottom && currentScrollY <= heroBottom) {
        canSkipHeroOnReturn.current = false;
        const originalScrollBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, section.offsetTop);
        requestAnimationFrame(() => {
          document.documentElement.style.scrollBehavior = originalScrollBehavior;
        });
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", skipLongHeroOnReturn, { passive: true });
    return () => window.removeEventListener("scroll", skipLongHeroOnReturn);
  }, []);

  const headingProgress = Math.min(1, progress / 0.12);
  const cardsVisible = Math.min(1, Math.max(0, (progress - 0.07) / 0.08));

  const moveToCard = (index: number) => {
    setActiveCard(Math.min(cards.length - 1, Math.max(0, index)));
  };

  return (
    <section ref={sectionRef} className="h-[700vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <img src="/hero-bg-no-beams.png" alt="Kervox connected business platform" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover lg:origin-[68%_64%] lg:translate-x-[calc(2.4%+95px)] lg:translate-y-[calc(-11%-15px)] lg:scale-[1.4835]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/50 lg:hidden" style={{ opacity: 1 - headingProgress }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.90)_60%,transparent_100%)] lg:block" style={{ opacity: 1 - headingProgress }} />
        <div className="absolute left-[5.7vw] top-[max(5.5rem,12svh)] z-30 w-[min(88vw,720px)] md:top-[22vh] lg:top-[23vh]" inert={headingProgress >= 0.99} style={{ opacity: 1 - headingProgress, transform: `translateX(${-headingProgress * 130}vw)`, pointerEvents: headingProgress >= 0.99 ? "none" : "auto" }}>
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-[11px] lg:text-xs">
            The complete customer acquisition &amp; management platform
          </p>
          <h1 className="mt-4 text-[clamp(2rem,3.1vw,3.5rem)] font-bold leading-[1.08] tracking-normal text-slate-950 max-[380px]:mt-3 max-[380px]:text-[1.75rem] md:mt-6">
            From First Click to Paying Customer.<br />
            <AnimatedUnderlineText text="One Platform." className="text-blue-600" />
          </h1>
          <p className="mt-4 max-w-[650px] text-sm leading-6 text-slate-600 max-[380px]:mt-3 max-[380px]:text-[13px] max-[380px]:leading-5 md:mt-5 md:text-base md:leading-7 lg:text-lg">Run marketing campaigns, convert visitors through high-performing funnels, capture applications in under 60 seconds, and automate approvals, onboarding, payments and member management.</p>
          <p className="mt-4 text-sm font-medium text-blue-800 md:mt-5 md:text-base">One connected system. From acquisition to ongoing operations.</p>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
            <a href="#contact" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Book a Demo</a>
            <a href="#services" className="rounded-xl border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Explore the Platform</a>
          </div>
        </div>

        <a
          href="#services"
          aria-label="Scroll down to explore more information"
          tabIndex={progress < 0.07 ? 0 : -1}
          className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-600 transition-opacity duration-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 md:bottom-9"
          style={{ opacity: Math.max(0, 1 - progress / 0.07), pointerEvents: progress < 0.07 ? "auto" : "none" }}
        >
          <span>Scroll to explore</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 motion-safe:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </a>

        <div className="absolute left-1/2 top-1/2 z-20 h-[342px] w-[min(calc(100vw-2rem),341px)] -translate-x-1/2 -translate-y-1/2 md:left-[calc(5rem+60px)] md:w-[341px] md:translate-x-0 lg:left-[calc(7rem+140px)]" style={{ opacity: cardsVisible, pointerEvents: cardsVisible > 0.8 ? "auto" : "none" }}>
          {cards.map((card, index) => {
            const offset = index - activeCard;
            const opacity = Math.max(0, 1 - Math.abs(offset));
            return (
              <div key={card.title} className="absolute inset-0 transition-[transform,opacity] duration-500 ease-out" style={{ opacity, transform: `translateX(${offset * 112}%)`, pointerEvents: opacity > 0.8 ? "auto" : "none" }}>
                <NotchedProjectCard className="h-full w-full" href="#contact" title={card.title} description={card.description} image={card.image} imageAlt={`${card.title} dashboard`} imageFit="cover" badge={String(index + 1).padStart(2, "0")} variant="hero" surface="#2563eb" accent="#2563eb" />
              </div>
            );
          })}
          <div className="absolute -bottom-14 right-0 flex items-center gap-2">
            <button type="button" aria-label="Show previous platform screen" onClick={() => moveToCard(Math.max(0, activeCard - 1))} disabled={activeCard === 0} className="grid size-10 place-items-center rounded-full border border-blue-200 bg-white text-blue-700 shadow-sm transition hover:border-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-35"><ArrowLeft className="size-4" /></button>
            <span className="min-w-12 text-center text-xs font-bold tracking-[0.16em] text-slate-600">{String(activeCard + 1).padStart(2, "0")} / 05</span>
            <button type="button" aria-label="Show next platform screen" onClick={() => moveToCard(Math.min(cards.length - 1, activeCard + 1))} disabled={activeCard === cards.length - 1} className="grid size-10 place-items-center rounded-full bg-blue-600 text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-35"><ArrowRight className="size-4" /></button>
          </div>
        </div>
        {activeCard === cards.length - 1 && cardsVisible > 0.8 && <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-blue-800 md:bottom-9"><span>Scroll to view more</span><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 motion-safe:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg></div>}
      </div>
    </section>
  );
}
