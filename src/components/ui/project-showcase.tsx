"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

export interface ShowcaseItem {
  title: string;
  description: string;
  number: string;
  image: string;
}

const defaultFeatures: ShowcaseItem[] = [
  { title: "Campaign", description: "Launch targeted marketing campaigns to attract new insurance members.", number: "01", image: "/section-images/feature-campaign.png" },
  { title: "Funnel", description: "Guide quotes and eligibility checks through a fast, reliable member journey.", number: "02", image: "/section-images/feature-funnel.png" },
  { title: "Application", description: "Run secure policy applications with infrastructure that scales with demand.", number: "03", image: "/section-images/feature-application.png" },
  { title: "CRM", description: "Keep brokers and service teams connected to the member information they need.", number: "04", image: "/section-images/feature-crm.png" },
  { title: "Database", description: "Protect claims, policy, and member records with dependable storage and backups.", number: "05", image: "/section-images/feature-database.png" },
];

const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";

interface ProjectShowcaseProps {
  id?: string;
  label?: string;
  eyebrow?: string;
  heading?: string;
  items?: ShowcaseItem[];
}

export function ProjectShowcase({
  id = "services",
  label = "FEATURES",
  eyebrow = "Platform features",
  heading = "A reliable foundation for every part of your operation.",
  items = defaultFeatures,
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = () => {
      setSmoothPosition((previous) => ({
        x: previous.x + (mousePosition.x - previous.x) * 0.15,
        y: previous.y + (mousePosition.y - previous.y) * 0.15,
      }));
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setMousePosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  };

  return (
    <section id={id} className="border-b border-slate-200 bg-white px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-[64px_minmax(0,1fr)] gap-5 md:grid-cols-[96px_minmax(0,1fr)] md:gap-8">
        <aside>
          <p className="sticky top-8 rotate-180 text-[80px] font-black italic leading-none text-blue-600 [writing-mode:vertical-rl]" style={{ fontFamily: sectionFont }}>{label}</p>
        </aside>

        <div ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full max-w-2xl justify-self-center text-center">
          <h2 className="text-sm font-medium uppercase text-slate-500">{eyebrow}</h2>
          <p className="mx-auto mt-3 max-w-xl text-2xl font-semibold text-slate-950 md:text-4xl">{heading}</p>

          <div
            className="pointer-events-none fixed z-50 hidden overflow-hidden rounded-xl border border-blue-100 bg-blue-50 shadow-2xl md:block"
            style={{
              left: containerRef.current?.getBoundingClientRect().left ?? 0,
              top: containerRef.current?.getBoundingClientRect().top ?? 0,
              transform: `translate3d(${smoothPosition.x + 24}px, ${smoothPosition.y - 104}px, 0)`,
              opacity: hoveredIndex === null ? 0 : 1,
              scale: hoveredIndex === null ? 0.85 : 1,
              transition: "opacity 180ms ease, scale 180ms ease",
            }}
          >
            <div className="relative h-72 w-72 bg-sky-50">
              {items.map((feature, index) => (
                <img key={feature.title} src={feature.image} alt="" className="absolute inset-0 h-full w-full object-contain transition-all duration-300" style={{ opacity: hoveredIndex === index ? 1 : 0, transform: hoveredIndex === index ? "scale(1)" : "scale(1.12)" }} />
              ))}
            </div>
          </div>

          <div className="mt-10 border-b border-slate-200 text-left">
            {items.map((feature, index) => (
              <div key={feature.title} className="group relative border-t border-slate-200 py-6" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                <div className={`absolute inset-0 -mx-4 rounded-md bg-blue-50/70 transition-all duration-300 ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} />
                <div className="relative flex items-start justify-between gap-4">
                  <img src={feature.image} alt="" className="h-16 w-16 shrink-0 rounded-lg border border-white/80 object-contain shadow-sm md:h-20 md:w-20" />
                  <div className="min-w-0 flex-1">
                    <div className="inline-flex items-center gap-2">
                      <h3 className="text-2xl font-black italic text-blue-600" style={{ fontFamily: sectionFont }}>
                        <span className="relative">{feature.title}<span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${hoveredIndex === index ? "w-full" : "w-0"}`} /></span>
                      </h3>
                      <ArrowUpRight className={`h-5 w-5 text-blue-600 transition-all duration-300 ${hoveredIndex === index ? "translate-x-0 translate-y-0 opacity-100" : "-translate-x-2 translate-y-2 opacity-0"}`} />
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-400">{feature.number}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
