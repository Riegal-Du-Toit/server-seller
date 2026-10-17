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
        {calendarUrl && <a href={calendarUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Choose a meeting time <ArrowRight className="ml-2 h-4 w-4" /></a>}
        {requestId && <p className="mt-4 text-xs text-slate-500">Reference: {requestId}</p>}
        <button type="button" onClick={() => setState("idle")} className="mt-6 block text-sm font-semibold text-blue-700 hover:underline">Submit another request</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} onFocus={() => { if (!hasTrackedStart.current) { hasTrackedStart.current = true; track("demo_form_started"); } }} className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-blue-950/5 sm:p-7" aria-describedby={error ? "demo-form-error" : undefined}>
      <p className="mb-4 text-sm text-slate-600">Fields marked * are required.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-slate-700">Name <span aria-hidden="true">*</span><input name="name" required autoComplete="name" maxLength={100} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
        <label className="text-sm font-medium text-slate-700">Work email <span aria-hidden="true">*</span><input name="email" required type="email" autoComplete="email" maxLength={200} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
        <label className="text-sm font-medium text-slate-700">Company <span aria-hidden="true">*</span><input name="company" required autoComplete="organization" maxLength={150} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
        <label className="text-sm font-medium text-slate-700">Phone<input name="phone" type="tel" autoComplete="tel" maxLength={40} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
      </div>
      <label className="mt-4 block text-sm font-medium text-slate-700">What would you like to improve? <span aria-hidden="true">*</span>
        <select name="interest" required defaultValue="" className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100">
          <option value="" disabled>Select an area</option><option>Customer acquisition</option><option>Digital applications</option><option>Approvals and onboarding</option><option>Payments and member management</option><option>Connected operations</option><option>Other</option>
        </select>
      </label>
      <label className="mt-4 block text-sm font-medium text-slate-700">Tell us about your needs<textarea name="message" rows={3} maxLength={2000} className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3.5 py-3 text-slate-950 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100" /></label>
      <label className="sr-only" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-600"><input name="consent" value="yes" type="checkbox" required className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600" /><span>I agree that Kervox may use these details to respond to my demo request. See our <a href="/privacy" className="font-medium text-blue-700 hover:underline">privacy notice</a>.</span></label>
      {error && <p id="demo-form-error" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{error}</p>}
      <Button type="submit" size="lg" disabled={state === "submitting"} className="mt-5 w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-70">
        {state === "submitting" ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Sending request…</> : <>Request a Demo <ArrowRight className="h-4 w-4" /></>}
      </Button>
      <p className="mt-3 text-center text-xs text-slate-500">Your details will be used to respond to your request.</p>
    </form>
  );
}
