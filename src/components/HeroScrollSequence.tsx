import { useEffect, useRef, useState } from "react";
import { ProductHighlightCard } from "@/components/ui/product-card";

const cards = [
  { title: "Campaigns", description: "Launch targeted campaigns, capture interest and connect your marketing directly to your sales pipeline.", icon: "/service-icons/campaign.png", angle: -4 },
  { title: "Funnels", description: "Create guided digital experiences that move customers from interest to action, without unnecessary steps or complicated processes.", icon: "/service-icons/funnel.png", angle: 3 },
  { title: "Applications", description: "Replace complicated paperwork and disconnected forms with structured digital applications designed for a smoother customer experience.", icon: "/service-icons/application.png", angle: -2 },
  { title: "CRM", description: "Give your teams one place to manage customer relationships, applications, follow-ups and ongoing service.", icon: "/service-icons/crm.png", angle: 5 },
  { title: "Database", description: "Bring customer information, operational records and business workflows together through a centralised data foundation.", icon: "/service-icons/database.png", angle: -3 },
];

export default function HeroScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  const scrollToDetails = () => {
    window.scrollBy({ top: Math.round(window.innerHeight * 1.5), behavior: "smooth" });
  };

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

  const headingProgress = Math.min(1, progress / 0.12);
  const cardStep = -1 + (Math.max(0, progress - 0.1) / 0.9) * (cards.length + 1);

  return (
    <section ref={sectionRef} className="h-[700vh] bg-white">
      <div className="sticky top-0 h-screen overflow-hidden bg-white">
        <img src="/hero-bg.png" alt="Kervox connected business platform" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover lg:translate-x-[2.4%] lg:-translate-y-[11%] lg:scale-[1.12]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-white/50 lg:hidden" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.90)_60%,transparent_100%)] lg:block" />
        <div className="absolute left-[5.7vw] top-[8svh] z-10 w-[min(88vw,720px)] md:top-[22vh] lg:top-[23vh]" style={{ opacity: 1 - headingProgress, transform: `translateX(${-headingProgress * 130}vw)` }}>
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-[11px] lg:text-xs">
            The complete business operating platform
            <span aria-hidden="true" className="hidden h-px w-14 bg-blue-300/70 sm:block" />
          </p>
          <h1 className="mt-4 text-[clamp(2rem,3.1vw,3.5rem)] font-bold leading-[1.08] tracking-normal text-slate-950 max-[380px]:mt-3 max-[380px]:text-[1.75rem] md:mt-6">
            Your Entire Business.<br />
            <span className="text-blue-600 lg:whitespace-nowrap">One Connected Platform.</span>
          </h1>
          <p className="mt-4 max-w-[650px] text-sm leading-6 text-slate-600 max-[380px]:mt-3 max-[380px]:text-[13px] max-[380px]:leading-5 md:mt-5 md:text-base md:leading-7 lg:text-lg">From your first marketing campaign to your thousandth customer,<br className="hidden lg:block" /> Kervox connects your campaign, funnel, application, onboarding,<br className="hidden lg:block" /> CRM, and database workflows into one powerful operating system.</p>
          <p className="mt-4 max-w-[620px] text-sm leading-6 text-slate-600 max-[380px]:mt-3 max-[380px]:text-[13px] max-[380px]:leading-5 md:mt-5 md:text-base md:leading-7 lg:text-lg">Attract customers. Convert leads. Simplify applications.<br className="hidden lg:block" /> Automate onboarding. Manage everything.</p>
          <p className="mt-6 text-sm text-blue-800/60 max-[380px]:mt-4 max-[380px]:text-[13px] md:mt-8 md:text-base">Built to grow with your business.</p>
        </div>

        <button
          type="button"
          aria-label="Scroll down to explore more information"
          onClick={scrollToDetails}
          className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-600 transition-opacity duration-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 md:bottom-9"
          style={{ opacity: Math.max(0, 1 - progress / 0.07), pointerEvents: progress < 0.07 ? "auto" : "none" }}
        >
          <span>Scroll to explore</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 motion-safe:animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <div className="absolute left-1/2 top-1/2 z-20 h-[300px] w-[min(80vw,300px)] -translate-x-1/2 -translate-y-1/2 md:left-20 md:h-[350px] md:w-[350px] md:translate-x-0 lg:left-28">
          {cards.map((card, index) => {
            const offset = index - cardStep;
            const opacity = Math.max(0, 1 - Math.abs(offset));
            return (
              <div key={card.title} className="absolute inset-0" style={{ opacity, transform: `translateY(${-offset * 125}%) rotate(${card.angle}deg)`, pointerEvents: opacity > 0.8 ? "auto" : "none" }}>
                <ProductHighlightCard
                  className="h-full w-full"
                  categoryIcon={<img src={card.icon} alt="" loading="lazy" decoding="async" className="h-6 w-6 object-contain" />}
                  category={`Feature ${String(index + 1).padStart(2, "0")}`}
                  title={card.title}
                  description={card.description}
                  imageSrc={card.icon}
                  imageAlt={`${card.title} illustration`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
