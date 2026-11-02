export default function CtaWithTextMarquee() {
  return (
    <section id="contact" className="border-y border-slate-200 bg-[radial-gradient(circle_at_90%_8%,rgba(59,130,246,.13),transparent_30%),linear-gradient(180deg,#fff,#f7fbff)] px-5 py-12 md:px-8 md:py-16" aria-labelledby="contact-heading">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="kervox-wordmark text-3xl leading-none">KERVO<span className="kervox-wordmark__accent">X</span></p>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-700 md:text-xs">Your next stage starts here</p>
        </div>
        <div className="mt-8 rounded-[24px] border border-blue-100 bg-white/90 p-7 text-center shadow-[0_28px_80px_rgba(20,73,150,.12)] md:p-12">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-700">ONE CONNECTED PLATFORM</p>
          <h2 id="contact-heading" className="mx-auto mt-3 max-w-3xl text-3xl font-black italic leading-[1.04] tracking-tight text-slate-950 md:text-5xl">
            Ready to Grow with <span className="text-blue-600">Kervox?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Three versions. One connected platform. Built around your business.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="https://kervox.cloud" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Explore Plans</a>
            <a href="https://kervox.cloud" className="rounded-xl border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">Book a Demo</a>
          </div>
        </div>
      </div>
    </section>
  );
}
