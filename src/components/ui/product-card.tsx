import * as React from "react";
import { cn } from "@/lib/utils";

interface ProductHighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  categoryIcon: React.ReactNode;
  number: string;
  title: string;
  tagline?: string;
  description: string;
}

export const ProductHighlightCard = React.forwardRef<HTMLDivElement, ProductHighlightCardProps>(
  ({ categoryIcon, number, title, tagline, description, className, ...props }, ref) => {
    const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
    const filterId = `glass-distortion-${React.useId().replace(/:/g, "")}`;

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      setTilt({
        x: ((event.clientY - bounds.top) / bounds.height - 0.5) * -7,
        y: ((event.clientX - bounds.left) / bounds.width - 0.5) * 7,
      });
    };

    return (
      <div
        ref={ref}
        className={cn("group relative h-[320px] w-[350px] overflow-hidden rounded-[26px] border border-[#008eff]/80 shadow-[0_24px_60px_rgba(30,64,175,0.22),0_8px_20px_rgba(65,128,190,0.14)]", className)}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ perspective: "1000px", ...props.style }}
        {...props}
      >
        <svg aria-hidden="true" className="absolute h-0 w-0">
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.001 0.005" numOctaves="1" seed="17" result="turbulence" />
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feDisplacementMap in="SourceGraphic" in2="softMap" scale="200" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] backdrop-blur-[3px] backdrop-saturate-150" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit]" style={{ backdropFilter: "blur(3px)", filter: `url(#${filterId})` }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(195,229,255,0.10)_42%,rgba(113,189,255,0.12)_70%,rgba(255,255,255,0.22)_100%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(ellipse_at_8%_0%,rgba(255,255,255,0.35),transparent_48%),radial-gradient(ellipse_at_100%_100%,rgba(79,168,255,0.14),transparent_50%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0.5px_0.5px_1px_rgba(52,174,255,0.65),inset_-0.5px_-0.5px_1px_rgba(0,142,255,0.5),inset_0_0_18px_rgba(255,255,255,0.3)]" />
        <div
          className="relative h-full w-full p-6 transition-transform duration-200 ease-out"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: "preserve-3d" }}
        >
          <div className="absolute left-5 right-5 top-0 h-px bg-[#36b6ff]/80" />
          <div className="relative z-10 flex items-center gap-4">
            <span className="text-4xl font-black leading-none tracking-tight text-[#007bd1]">
              {number}
            </span>
            {categoryIcon}
          </div>
          <h2
            className="relative z-10 mt-6 text-[2.25rem] font-black italic leading-tight text-[#007bd1] md:text-[2.625rem]"
            style={{ fontFamily: "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif" }}
          >
            {title}
          </h2>
          {tagline && <p className="relative z-10 mt-2 text-xl font-semibold leading-7 text-slate-950 md:text-[1.35rem] md:leading-8">{tagline}</p>}
          <p className="relative z-10 mt-4 max-w-none text-lg leading-7 text-black md:text-xl md:leading-9">{description}</p>
        </div>
      </div>
    );
  },
);

ProductHighlightCard.displayName = "ProductHighlightCard";
