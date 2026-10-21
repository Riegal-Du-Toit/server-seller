import { useRef, useState, type SyntheticEvent } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type FormState = "idle" | "submitting" | "success" | "error";

export default function DemoRequestForm() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState("");
  const [requestId, setRequestId] = useState("");
  const [calendarUrl, setCalendarUrl] = useState("");
  const hasTrackedStart = useRef(false);
  const fieldClass = "mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-slate-950 shadow-[inset_0_1px_2px_rgba(15,23,42,0.03)] outline-none transition duration-200 placeholder:text-slate-400 hover:border-sky-200 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100";
  const labelClass = "text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600";

  const track = (event: string, data: Record<string, unknown> = {}) => {
    window.dispatchEvent(new CustomEvent(`kervox:${event}`, { detail: data }));
    const analyticsWindow = window as Window & { dataLayer?: Record<string, unknown>[] };
    analyticsWindow.dataLayer?.push({ event: `kervox_${event}`, ...data });
  };

  const submit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    setState("submitting");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const response = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json()) as { requestId?: string; message?: string; calendarUrl?: string };
      if (!response.ok) throw new Error(result.message || "We could not submit your request.");
      setRequestId(result.requestId || "");
      setCalendarUrl(result.calendarUrl || "");
      setState("success");
      form.reset();
      track("demo_request_success", { requestId: result.requestId });
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "We could not submit your request.");
      setState("error");
      track("demo_request_error");
    }
  };

  if (state === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-7" role="status" aria-live="polite">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        <h3 className="mt-4 text-2xl font-semibold text-slate-950">Demo request received.</h3>
        <p className="mt-2 leading-7 text-slate-600">Our team will contact you to arrange a suitable time.</p>
        {calendarUrl && <a href={calendarUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Choose a meeting time <ArrowRight className="ml-2 h-4 w-4" /></a>}
        {requestId && <p className="mt-4 text-xs text-slate-500">Reference: {requestId}</p>}
        <button type="button" onClick={() => setState("idle")} className="mt-6 block text-sm font-semibold text-blue-700 hover:underline">Submit another request</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} onFocus={() => { if (!hasTrackedStart.current) { hasTrackedStart.current = true; track("demo_form_started"); } }} className="w-full border border-slate-200 border-t-4 border-t-blue-600 bg-white p-6 shadow-[0_18px_45px_rgba(15,55,100,0.1)] sm:p-7" aria-describedby={error ? "demo-form-error" : undefined}>
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Request a demo</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">See Kervox in action.</h3>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-blue-200 bg-blue-50 text-sm font-bold text-blue-700">01</span>
      </div>
      <p className="mb-5 text-xs text-slate-500">Fields marked <span className="font-semibold text-blue-700">*</span> are required.</p>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelClass}>Name <span aria-hidden="true" className="text-blue-600">*</span><input name="name" required autoComplete="name" maxLength={100} className={fieldClass} /></label>
        <label className={labelClass}>Work email <span aria-hidden="true" className="text-blue-600">*</span><input name="email" required type="email" autoComplete="email" maxLength={200} className={fieldClass} /></label>
        <label className={labelClass}>Company <span aria-hidden="true" className="text-blue-600">*</span><input name="company" required autoComplete="organization" maxLength={150} className={fieldClass} /></label>
        <label className={labelClass}>Phone<input name="phone" type="tel" autoComplete="tel" maxLength={40} className={fieldClass} /></label>
      </div>
      <label className={`mt-5 block ${labelClass}`}>What would you like to improve? <span aria-hidden="true" className="text-blue-600">*</span>
        <select name="interest" required defaultValue="" className={fieldClass}>
          <option value="" disabled>Select an area</option><option>Customer acquisition</option><option>Digital applications</option><option>Approvals and onboarding</option><option>Payments and member management</option><option>Connected operations</option><option>Other</option>
        </select>
      </label>
      <label className={`mt-5 block ${labelClass}`}>Tell us about your needs<textarea name="message" rows={3} maxLength={2000} className={`${fieldClass} resize-y`} /></label>
      <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="mt-5 flex items-start gap-3 border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600"><input name="consent" value="yes" type="checkbox" required className="mt-0.5 h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500" /><span>I agree that Kervox may use these details to respond to my demo request. See our <a href="/privacy" className="font-semibold text-blue-700 hover:underline">privacy notice</a>.</span></label>
      {error && <p id="demo-form-error" className="mt-4 border border-red-100 bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <Button type="submit" size="lg" disabled={state === "submitting"} className="mt-5 h-12 w-full rounded-none bg-gradient-to-r from-blue-700 to-sky-500 text-white shadow-lg shadow-blue-600/25 hover:from-blue-800 hover:to-sky-600 disabled:opacity-70">
        {state === "submitting" ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Sending request…</> : <>Request a Demo <ArrowRight className="h-4 w-4" /></>}
      </Button>
      <p className="mt-3 text-center text-xs text-slate-500">Your details will be used to respond to your request.</p>
    </form>
  );
}
