import * as React from "react";
import { cn } from "@/lib/utils";

interface ProductHighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  categoryIcon: React.ReactNode;
  category: string;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const ProductHighlightCard = React.forwardRef<HTMLDivElement, ProductHighlightCardProps>(
  ({ categoryIcon, category, title, description, imageSrc, imageAlt, className, ...props }, ref) => {
    const [tilt, setTilt] = React.useState({ x: 0, y: 0 });

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
        className={cn("group relative h-[350px] w-[350px] overflow-hidden rounded-2xl border border-white/70 bg-white/15 shadow-[0_24px_70px_rgba(30,64,175,0.2)] backdrop-blur-3xl", className)}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setTilt({ x: 0, y: 0 })}
        style={{ perspective: "1000px", ...props.style }}
        {...props}
      >
        <div
          className="relative h-full w-full p-6 transition-transform duration-200 ease-out"
          style={{ transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`, transformStyle: "preserve-3d" }}
        >
          <div className="absolute left-5 right-5 top-0 h-px bg-white/90" />
          <div className="relative z-10 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
            {categoryIcon}
            <span>{category}</span>
          </div>
          <h2
            className="relative z-10 mt-5 max-w-[11rem] text-4xl font-black italic leading-none text-blue-600"
            style={{ fontFamily: "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif" }}
          >
            {title}
          </h2>
          <p className="relative z-10 mt-4 max-w-[12rem] text-sm leading-6 text-slate-600">{description}</p>
          <div
            className="absolute bottom-6 right-5 h-[46%] w-[46%] transition-transform duration-300 group-hover:scale-110"
            style={{ transform: "translateZ(72px) rotate(-7deg)", transformStyle: "preserve-3d" }}
          >
            <div className="absolute bottom-0 left-[12%] h-4 w-[76%] rounded-full bg-blue-700/25 blur-md" style={{ transform: "translateZ(-20px)" }} />
            <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" className="relative h-full w-full object-contain object-bottom-right drop-shadow-[0_16px_12px_rgba(30,64,175,0.35)]" />
          </div>
        </div>
      </div>
    );
  },
);

ProductHighlightCard.displayName = "ProductHighlightCard";
