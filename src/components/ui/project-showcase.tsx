"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

export interface ShowcaseItem {
  title: string;
  tagline?: string;
  description: string;
  number: string;
  image: string;
}

const defaultFeatures: ShowcaseItem[] = [
  { title: "Marketing", description: "Launch targeted campaigns, capture interest and connect your marketing directly to your sales pipeline.", number: "01", image: "/section-images/feature-campaign.png" },
  { title: "Funnels", description: "Create guided digital experiences that move customers from interest to action, without unnecessary steps or complicated processes.", number: "02", image: "/section-images/feature-funnel.png" },
  { title: "Applications", description: "Replace complicated paperwork and disconnected forms with structured digital applications designed for a smoother customer experience.", number: "03", image: "/section-images/feature-application.png" },
  { title: "Management", description: "Give your teams one place to manage customer relationships, applications, follow-ups and ongoing service.", number: "04", image: "/section-images/feature-crm.png" },
  { title: "Database & Finance", description: "Bring customer information, operational records and business workflows together through a centralised data foundation.", number: "05", image: "/section-images/feature-database.png" },
];

const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";

interface ProjectShowcaseProps {
  id?: string;
  label?: string;
  eyebrow?: string;
  heading?: string;
  items?: ShowcaseItem[];
  intro?: string[];
  closing?: string;
  showTitles?: boolean;
}

export function ProjectShowcase({
  id = "services",
  label = "FEATURES",
  eyebrow = "The complete business operating platform",
  heading = "Every stage of your business. Connected.",
  items = defaultFeatures,
  intro,
  closing,
  showTitles = true,
}: ProjectShowcaseProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [smoothPosition, setSmoothPosition] = useState({ x: 0, y: 0 });
  const positionRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (hoveredIndex === null) return;
    const animate = () => {
      const previous = positionRef.current;
      const deltaX = mousePosition.x - previous.x;
      const deltaY = mousePosition.y - previous.y;
      const settled = Math.abs(deltaX) < 0.25 && Math.abs(deltaY) < 0.25;
      positionRef.current = settled ? mousePosition : { x: previous.x + deltaX * 0.15, y: previous.y + deltaY * 0.15 };
      setSmoothPosition(positionRef.current);
      if (!settled) animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [hoveredIndex, mousePosition]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    setMousePosition({ x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  };

  return (
    <section id={id} className="border-b border-slate-200 bg-white px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-[64px_minmax(0,1fr)] gap-5 md:grid-cols-[96px_minmax(0,1fr)] md:gap-8">
        <aside>
          <p className="sticky top-8 rotate-180 text-[56px] font-black italic leading-none text-blue-600 [writing-mode:vertical-rl] md:text-[80px]" style={{ fontFamily: sectionFont }}>{label}</p>
        </aside>

        <div ref={containerRef} onMouseMove={handleMouseMove} className="relative w-full max-w-2xl justify-self-center text-center">
          <p className="text-sm font-medium uppercase text-slate-500">{eyebrow}</p>
          <h2 className="mx-auto mt-3 max-w-xl text-2xl font-semibold text-slate-950 md:text-4xl">{heading}</h2>
          {intro && <div className="mx-auto mt-6 max-w-2xl space-y-3 text-sm leading-6 text-slate-600 md:text-base md:leading-7">{intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>}

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
                <img key={feature.title} src={feature.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain transition-all duration-300" style={{ opacity: hoveredIndex === index ? 1 : 0, transform: hoveredIndex === index ? "scale(1)" : "scale(1.12)" }} />
              ))}
            </div>
          </div>

          <div className="mt-10 border-b border-slate-200 text-left">
            {items.map((feature, index) => (
              <div key={feature.title} className="group relative border-t border-slate-200 py-6" onMouseEnter={() => setHoveredIndex(index)} onMouseLeave={() => setHoveredIndex(null)}>
                <div className={`absolute inset-0 -mx-4 rounded-md bg-blue-50/70 transition-all duration-300 max-[480px]:mx-0 ${hoveredIndex === index ? "opacity-100 scale-100" : "opacity-0 scale-95"}`} />
                <div className="relative flex items-start justify-between gap-4 max-[480px]:flex-wrap">
                  <img src={feature.image} alt="" loading="lazy" decoding="async" className="h-16 w-16 shrink-0 rounded-lg border border-white/80 object-contain shadow-sm max-[480px]:h-14 max-[480px]:w-14 md:h-20 md:w-20" />
                  <div className="min-w-0 flex-1 max-[480px]:order-3 max-[480px]:w-full max-[480px]:flex-none">
                    <div className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-1">
                      {showTitles && <h3 className="min-w-0 break-words text-xl font-black italic text-blue-600 sm:text-2xl" style={{ fontFamily: sectionFont }}>
                        <span className="relative">{feature.title}<span className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${hoveredIndex === index ? "w-full" : "w-0"}`} /></span>
                      </h3>}
                      {feature.tagline && <p className="text-sm font-semibold leading-5 text-slate-950 sm:text-base">{showTitles && "— "}{feature.tagline}</p>}
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">{feature.description}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-400 max-[480px]:order-2">{feature.number}</span>
                </div>
              </div>
            ))}
          </div>
          {closing && <p className="mx-auto mt-10 max-w-2xl text-xl font-semibold leading-8 text-slate-950 md:text-2xl">{closing}</p>}
        </div>
      </div>
    </section>
  );
}
