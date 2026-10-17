import { useEffect, useRef, useState } from "react";
import { ProductHighlightCard } from "@/components/ui/product-card";

const cards = [
  { title: "Marketing", tagline: "More Sales. Less Friction.", description: "Turn marketing traffic into completed applications with conversion-focused funnels and streamlined customer journeys.", icon: "/service-icons/campaign.png", angle: -4 },
  { title: "Funnels", tagline: "Applications in Under 60 Seconds.", description: "Make it easier for customers to apply with fast digital forms, automatic or manual approvals, and structured onboarding.", icon: "/service-icons/funnel.png", angle: 3 },
  { title: "Applications", tagline: "Automate the Work Behind Every Sale.", description: "Reduce repetitive administration with automated handovers, approval workflows, customer records and payment processes.", icon: "/service-icons/application.png", angle: -2 },
  { title: "Management", tagline: "Get Paid. Stay in Control.", description: "Manage debit orders, payment collections, reconciliation and customer accounts from one connected platform.", icon: "/service-icons/crm.png", angle: 5 },
  { title: "Database & Finance", tagline: "Turn Your Database Into Growth.", description: "Manage existing members, identify upsell opportunities, reactivate customers and track performance through reporting dashboards.", icon: "/service-icons/database.png", angle: -3 },
];

export default function HeroScrollSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

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
        <div className="absolute left-[5.7vw] top-[max(5.5rem,12svh)] z-30 w-[min(88vw,720px)] md:top-[22vh] lg:top-[23vh]" inert={headingProgress >= 0.99} style={{ opacity: 1 - headingProgress, transform: `translateX(${-headingProgress * 130}vw)`, pointerEvents: headingProgress >= 0.99 ? "none" : "auto" }}>
          <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-700 sm:text-[11px] lg:text-xs">
            The complete customer acquisition &amp; management platform
            <span aria-hidden="true" className="hidden h-px w-14 bg-blue-300/70 sm:block" />
          </p>
          <h1 className="mt-4 text-[clamp(2rem,3.1vw,3.5rem)] font-bold leading-[1.08] tracking-normal text-slate-950 max-[380px]:mt-3 max-[380px]:text-[1.75rem] md:mt-6">
            From First Click to Paying Customer.<br />
            <span className="text-blue-600">One Platform.</span>
          </h1>
          <p className="mt-4 max-w-[650px] text-sm leading-6 text-slate-600 max-[380px]:mt-3 max-[380px]:text-[13px] max-[380px]:leading-5 md:mt-5 md:text-base md:leading-7 lg:text-lg">Run marketing campaigns, convert visitors through high-performing funnels, capture applications in under 60 seconds, and automate approvals, onboarding, payments and member management.</p>
          <p className="mt-4 text-sm font-medium text-blue-800 md:mt-5 md:text-base">One connected system. From acquisition to ongoing operations.</p>
          <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
            <a href="#contact" className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">Book a Demo</a>
            <a href="#services" className="rounded-full border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Explore the Platform</a>
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

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[300px] w-[min(80vw,300px)] -translate-x-1/2 -translate-y-1/2 md:left-20 md:h-[350px] md:w-[350px] md:translate-x-0 lg:left-28">
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
                  tagline={card.tagline}
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
