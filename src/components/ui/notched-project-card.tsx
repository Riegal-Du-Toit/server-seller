"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface NotchedProjectCardProps {
  href: string;
  title: string;
  description?: string;
  image: string;
  imageAlt?: string;
  badge?: string;
  imageFit?: "cover" | "contain" | "fill";
  variant?: "default" | "hero";
  surface?: string;
  accent?: string;
  accentForeground?: string;
  className?: string;
}

const DISC = 56;
const BLOCK = 72;
const FILLET = 24;

export function NotchedProjectCard({
  href,
  title,
  description,
  image,
  imageAlt = "",
  badge,
  imageFit = "cover",
  variant = "default",
  surface = "#ffffff",
  accent = "#2563eb",
  accentForeground = "#ffffff",
  className,
}: NotchedProjectCardProps) {
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const showExpandedPreview = variant === "hero" && previewOpen;

  return (
    <div
      data-href={href}
      className={cn("group outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4", variant === "hero" ? "flex flex-col" : "flex flex-col", className)}
    >
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            className={cn(
              "absolute inset-0 h-full w-full transition-opacity duration-300",
              imageFit === "contain" ? "object-contain p-2" : imageFit === "fill" ? "object-fill" : "object-cover",
              variant === "hero" && "opacity-60",
            )}
          />
          {variant === "hero" && <button type="button" onClick={() => setPreviewOpen(true)} className="absolute left-1/2 top-1/2 z-10 flex size-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-blue-600/80 px-3 text-center text-xs font-bold leading-tight tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_28px_rgba(15,60,95,0.32)] backdrop-blur-xl transition duration-200 hover:scale-105 hover:bg-blue-700/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Click<br />to view</button>}
        </div>

        <div aria-hidden className="absolute bottom-0 right-0" style={{ width: BLOCK, height: BLOCK, borderTopLeftRadius: BLOCK - DISC / 2, borderBottomRightRadius: 26, background: surface }} />
        {[{ bottom: BLOCK, right: 0 }, { bottom: 0, right: BLOCK }].map((position, index) => <div key={index} aria-hidden className="absolute" style={{ ...position, width: FILLET, height: FILLET, background: `radial-gradient(circle at top left, transparent ${FILLET - 0.5}px, ${surface} ${FILLET}px)` }} />)}
        <span aria-hidden className="absolute bottom-1 right-1 flex items-center justify-center rounded-full border border-white bg-slate-950 text-[22px] font-black italic leading-none tracking-[-0.1em] text-white [font-variant-numeric:tabular-nums]" style={{ width: DISC, height: DISC, backgroundColor: accent, color: accentForeground }}>{badge}</span>
      </div>

      <h3 className={cn("mt-4 font-black italic tracking-tight text-blue-600", variant === "hero" ? "text-xl" : "text-2xl")}>{title}</h3>
      {description ? <p className={cn("mt-2 line-clamp-3 leading-6 text-slate-800", variant === "hero" ? "w-[300px] text-sm font-medium" : "w-full text-sm font-medium")}>{description}</p> : null}

      {variant === "hero" && typeof document !== "undefined" && createPortal(<div role="dialog" aria-modal="true" aria-label={`${title} full-size image`} onClick={() => setPreviewOpen(false)} className={cn("fixed inset-0 z-[60] grid place-items-center bg-slate-950/55 p-8 backdrop-blur-sm transition-opacity duration-200", showExpandedPreview ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0")}>
        <div onClick={(event) => event.stopPropagation()} className={cn("relative w-[min(92vw,1120px)] overflow-hidden rounded-2xl border border-white/50 bg-white shadow-2xl transition-transform duration-200", showExpandedPreview ? "scale-100" : "scale-95")}>
          <button type="button" onClick={() => setPreviewOpen(false)} className="absolute left-1/2 top-1/2 z-10 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-blue-600/80 text-xs font-bold tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_10px_28px_rgba(0,45,110,0.34)] backdrop-blur-xl transition duration-200 hover:scale-105 hover:bg-blue-700/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">Close</button>
          <img src={image} alt="" className="block h-auto max-h-[76vh] w-full object-contain" />
        </div>
      </div>, document.body)}
    </div>
  );
}

export default NotchedProjectCard;
