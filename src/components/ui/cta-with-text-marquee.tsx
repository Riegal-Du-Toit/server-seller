import DemoRequestForm from "@/components/DemoRequestForm";
import AnimatedUnderlineText from "@/components/AnimatedUnderlineText";

const sectionFont = "'Arial Black', 'Arial Narrow Bold', Impact, sans-serif";

export default function CtaWithTextMarquee() {
  return (
    <section id="contact" className="border-y border-slate-200 bg-white" aria-labelledby="cta-heading">
      <div className="mx-auto grid max-w-6xl lg:min-h-[680px] lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-start px-5 py-16 md:px-12 lg:pb-24 lg:pt-12">
          <p className="kervox-wordmark text-3xl leading-none"><span>KERVO</span><span className="kervox-wordmark__accent">X</span></p>
          <p className="mt-7 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Your next stage starts here</p>
          <h2 id="cta-heading" className="mt-5 max-w-none text-4xl font-black italic leading-[1.05] text-blue-600 md:text-5xl" style={{ fontFamily: sectionFont }}>
            <AnimatedUnderlineText text="One Platform." className="whitespace-nowrap" /> <br /><span className="whitespace-nowrap">Bigger Possibilities.</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 md:text-lg">
            Whether you're replacing manual processes, connecting existing systems or building a digital operation from the ground up, Kervox gives you a foundation to build on.
          </p>
          <p className="mt-8 text-sm font-semibold text-blue-700">What happens next</p>
          <ol className="mt-3 space-y-2 text-sm leading-6 text-slate-600"><li>1. We review your goals.</li><li>2. We arrange a suitable time.</li><li>3. You see the workflows relevant to your business.</li></ol>
        </div>
        <div className="border-l border-slate-100 bg-white px-5 py-12 md:px-12 lg:flex lg:items-center lg:py-20"><DemoRequestForm /></div>
      </div>
    </section>
  );
}
