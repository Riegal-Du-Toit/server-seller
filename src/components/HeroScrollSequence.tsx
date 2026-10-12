import { useEffect, useRef, useState } from "react";
import { ProductHighlightCard } from "@/components/ui/product-card";

const cards = [
  { title: "Campaign", description: "Launch targeted marketing campaigns to attract new insurance members.", icon: "/service-icons/campaign.png", angle: -4 },
  { title: "Funnel", description: "Guide quotes and eligibility checks through a fast, reliable member journey.", icon: "/service-icons/funnel.png", angle: 3 },
  { title: "Application", description: "Run secure policy applications with infrastructure that scales with demand.", icon: "/service-icons/application.png", angle: -2 },
  { title: "CRM", description: "Keep brokers and service teams connected to the member information they need.", icon: "/service-icons/crm.png", angle: 5 },
  { title: "Database", description: "Protect claims, policy, and member records with dependable storage and backups.", icon: "/service-icons/database.png", angle: -3 },
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
      <div className="sticky top-0 h-screen overflow-hidden">
        <img src="/hero-bg.png" alt="Cloud-hosted server" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute left-5 top-1/2 z-10 w-[min(88vw,540px)] md:left-10 lg:left-16" style={{ opacity: 1 - headingProgress, transform: `translate(${-headingProgress * 130}vw, -50%)` }}>
          <h1 className="text-3xl font-bold leading-[1.1] text-slate-950 md:text-5xl">
            Cloud Infrastructure for<br />
            <span className="text-blue-600">Medical Insurance<br />Companies</span>
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-6 text-slate-600 md:text-base md:leading-7">Secure, scalable server hosting for policy, claims, and member operations.</p>
        </div>

        <div className="absolute left-1/2 top-1/2 z-20 h-[300px] w-[min(80vw,300px)] -translate-x-1/2 -translate-y-1/2 md:left-20 md:h-[350px] md:w-[350px] md:translate-x-0 lg:left-28">
          {cards.map((card, index) => {
            const offset = index - cardStep;
            const opacity = Math.max(0, 1 - Math.abs(offset));
            return (
              <div key={card.title} className="absolute inset-0" style={{ opacity, transform: `translateY(${-offset * 125}%) rotate(${card.angle}deg)`, pointerEvents: opacity > 0.8 ? "auto" : "none" }}>
                <ProductHighlightCard
                  className="h-full w-full"
                  categoryIcon={<img src={card.icon} alt="" className="h-6 w-6 object-contain" />}
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
