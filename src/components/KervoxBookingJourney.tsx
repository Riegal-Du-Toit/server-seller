"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, Clock3, GripVertical, Mail, MonitorPlay, Sparkles, X } from "lucide-react";

const options = [
  "Generate qualified leads",
  "Build better funnels",
  "Digitise applications",
  "Automate approvals",
  "Improve onboarding",
  "Manage customers",
  "Collect payments",
  "Unify reporting",
  "Faster follow-up",
  "Centralise data",
  "Less admin",
  "Self-service",
];

const timelines = ["Exploring", "This quarter", "Next 3 months", "Later this year"];
const decisions = ["Decision maker", "Decision influencer", "Researching options"];
const responseStyles = [
  "bg-blue-50 text-blue-700",
  "bg-violet-50 text-violet-700",
  "bg-teal-50 text-teal-700",
  "bg-amber-50 text-amber-700",
  "bg-rose-50 text-rose-700",
  "bg-sky-50 text-sky-700",
  "bg-emerald-50 text-emerald-700",
];
const timeZones = [
  { label: "Cebu City (GMT+8)", value: "Asia/Manila" },
  { label: "Johannesburg (GMT+2)", value: "Africa/Johannesburg" },
  { label: "London (GMT+0)", value: "Europe/London" },
];
type Slot = { start: string };
type DayGroup = { key: string; date: Date; slots: Slot[] };
type Localisation = { timeZone?: string; price?: { formatted?: string; currency?: string } };

function timeZoneLabel(timeZone: string) {
  return timeZones.find((zone) => zone.value === timeZone)?.label ?? `Your local time (${timeZone.replace("_", " ")})`;
}

type PillPickerProps = { items: string[]; value: string; onChange: (item: string) => void };

function PillPicker({ items, value, onChange }: PillPickerProps) {
  return <div className="mt-2 flex flex-nowrap gap-1.5">
    {items.map((item, index) => <button key={item} type="button" onClick={() => onChange(item)} className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-1.5 py-1 text-[10px] font-bold transition ${responseStyles[index]} ${value === item ? "ring-1 ring-current shadow-sm" : "opacity-70 hover:opacity-100"}`}><span className="size-1 rounded-full bg-current" />{item}</button>)}
  </div>;
}

function teamSizeLabel(size: number) {
  return size >= 500 ? "500+ people" : `${size} ${size === 1 ? "person" : "people"}`;
}

function displayDate(value: string, timeZone: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { timeZone, ...options }).format(new Date(value));
}

function dayKey(value: string, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
}

function groupSlots(slots: Slot[], timeZone: string): DayGroup[] {
  const days = new Map<string, DayGroup>();
  slots.forEach((slot) => {
    const key = dayKey(slot.start, timeZone);
    const current = days.get(key);
    if (current) current.slots.push(slot);
    else days.set(key, { key, date: new Date(slot.start), slots: [slot] });
  });
  return [...days.values()].slice(0, 5);
}

export default function KervoxBookingJourney() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState(35);
  const [timeline, setTimeline] = useState("");
  const [decision, setDecision] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [dragged, setDragged] = useState<string | null>(null);
  const [problem, setProblem] = useState("");
  const [duration, setDuration] = useState(30);
  const [timeZone, setTimeZone] = useState("Asia/Manila");
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [slotsState, setSlotsState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [slotsError, setSlotsError] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookingState, setBookingState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [bookingError, setBookingError] = useState("");
  const availableDays = useMemo(() => groupSlots(availableSlots, timeZone), [availableSlots, timeZone]);
  const selectedDaySlots = availableDays.find((day) => day.key === selectedDay)?.slots ?? [];
  const timeZoneOptions = useMemo(() => timeZones.some((zone) => zone.value === timeZone) ? timeZones : [{ label: timeZoneLabel(timeZone), value: timeZone }, ...timeZones], [timeZone]);

  const readyToBook = role.trim().length > 1 && Boolean(timeline) && Boolean(decision) && focus.length === 3 && problem.trim().length > 2;
  const canConfirm = Boolean(selectedSlot) && name.trim().length > 1 && /^\S+@\S+\.\S+$/.test(email);

  useEffect(() => {
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const controller = new AbortController();
    fetch(`/api/localisation?timeZone=${encodeURIComponent(browserTimeZone)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Localisation unavailable");
        return await response.json() as Localisation;
      })
      .then((result) => {
        if (result.timeZone) setTimeZone(result.timeZone);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (step !== 1) return;
    const controller = new AbortController();
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() + 21);
    setSlotsState("loading");
    setSlotsError("");
    setSelectedDay("");
    setSelectedSlot("");
    fetch(`/api/booking/availability?startTime=${encodeURIComponent(now.toISOString())}&endTime=${encodeURIComponent(end.toISOString())}&timeZone=${encodeURIComponent(timeZone)}&duration=${duration}`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json().catch(() => ({})) as { slots?: Slot[]; message?: string };
        if (!response.ok) throw new Error(result.message || "We could not load open times.");
        return result.slots ?? [];
      })
      .then((slots) => {
        setAvailableSlots(slots);
        setSlotsState("ready");
        const firstDay = groupSlots(slots, timeZone)[0];
        if (firstDay) setSelectedDay(firstDay.key);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setAvailableSlots([]);
        setSlotsError(error instanceof Error ? error.message : "We could not load open times.");
        setSlotsState("error");
      });
    return () => controller.abort();
  }, [step, duration, timeZone]);

  const choose = (item: string) => setFocus((current) => current.includes(item) ? current.filter((entry) => entry !== item) : current.length < 3 ? [...current, item] : current);
  const drop = (rank: number) => {
    if (!dragged) return;
    setFocus((current) => {
      const withoutDragged = current.filter((item) => item !== dragged);
      return [...withoutDragged.slice(0, rank), dragged, ...withoutDragged.slice(rank)].slice(0, 3);
    });
    setDragged(null);
  };

  const restart = () => {
    setStep(0); setRole(""); setTeamSize(35); setTimeline(""); setDecision(""); setFocus([]); setDragged(null); setProblem("");
    setDuration(30); setTimeZone("Asia/Manila"); setAvailableSlots([]); setSlotsState("idle"); setSlotsError(""); setSelectedDay(""); setSelectedSlot(""); setName(""); setEmail(""); setBookingState("idle"); setBookingError("");
  };

  const confirmBooking = async () => {
    if (!canConfirm) return;
    setBookingState("saving");
    setBookingError("");
    try {
      const response = await fetch("/api/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          start: selectedSlot,
          timeZone,
          duration,
          role,
          teamSize,
          priorities: focus,
          problem,
          timeline,
          decisionRole: decision,
          website: "",
        }),
      });
      const result = await response.json().catch(() => ({})) as { message?: string; start?: string };
      if (!response.ok) throw new Error(result.message || "We could not confirm that time. Please try again.");
      if (result.start) setSelectedSlot(result.start);
      setBookingState("success");
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "We could not confirm that time. Please try again.");
      setBookingState("error");
    }
  };

  if (step === 1) {
    return <section id="contact" className="border-y border-slate-200 bg-[radial-gradient(circle_at_90%_8%,rgba(59,130,246,.13),transparent_30%),linear-gradient(180deg,#fff,#f7fbff)] px-5 py-6 md:px-8 md:py-8" aria-labelledby="booking-heading">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="kervox-wordmark text-3xl leading-none">KERVO<span className="kervox-wordmark__accent">X</span></p>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setStep(0)} className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Edit answers</button>
            <button type="button" onClick={restart} className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold uppercase tracking-[.12em] text-blue-700 transition hover:border-blue-600 hover:bg-blue-50">Start over</button>
          </div>
        </div>
        <div className="mt-5 rounded-[24px] border border-blue-100 bg-white/90 p-5 pt-3 shadow-[0_28px_80px_rgba(20,73,150,.12)] md:p-7 md:pt-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-blue-600 text-xs font-black text-white"><Check className="size-4" /></span><span className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Your context</span></div>
            <div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">2</span><span className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Book</span></div>
          </div>

          {bookingState === "success" ? <div className="mx-auto flex min-h-[330px] max-w-xl flex-col items-center justify-center text-center">
            <span className="grid size-14 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="size-7" /></span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.14em] text-emerald-700">Time reserved</p>
            <h2 id="booking-heading" className="mt-2 text-3xl font-bold tracking-tight text-slate-950">You are booked in.</h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">We will send the video-call details to {email}. Your Kervox session is set for {displayDate(selectedSlot, timeZone, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" })}.</p>
            <button type="button" onClick={restart} className="mt-6 rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50">Book another session</button>
          </div> : <div className="grid gap-8 py-6 lg:grid-cols-[.82fr_1.18fr] lg:gap-10">
            <aside className="border-b border-slate-100 pb-6 lg:border-b-0 lg:border-r lg:pr-8 lg:pb-0">
              <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Your tailored session</p>
              <h2 id="booking-heading" className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">A plan around what matters.</h2>
              <p className="mt-2 text-sm leading-5 text-slate-600">We will use your selected priorities to make the conversation useful from the first minute.</p>
              <div className="mt-5 flex flex-wrap gap-2">{focus.map((item, index) => <span key={item} className={`rounded-full px-3 py-1.5 text-xs font-bold ${["bg-blue-50 text-blue-700", "bg-violet-50 text-violet-700", "bg-emerald-50 text-emerald-700"][index]}`}>{item}</span>)}</div>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-[.12em] text-slate-500">Session length</p>
                <div className="mt-2 inline-flex rounded-xl bg-slate-100 p-1">{[30, 45].map((minutes) => <button key={minutes} type="button" onClick={() => setDuration(minutes)} className={`rounded-lg px-4 py-2 text-sm font-bold transition ${duration === minutes ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>{minutes} min</button>)}</div>
              </div>
              <label className="mt-5 block text-xs font-bold uppercase tracking-[.12em] text-slate-500">Show times in<select value={timeZone} onChange={(event) => setTimeZone(event.target.value)} className="mt-2 block h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none focus:border-blue-500">{timeZoneOptions.map((zone) => <option key={zone.value} value={zone.value}>{zone.label}</option>)}</select></label>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-600"><MonitorPlay className="size-4 text-blue-600" /> Video call - link sent after booking</p>
            </aside>

            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Step 2 of 2</p>
              <div className="mt-2 flex items-end justify-between gap-4"><h3 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Choose a time.</h3><p className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-slate-500"><Clock3 className="size-3.5" /> {duration} minutes</p></div>
              {slotsState === "loading" ? <div className="mt-4 grid grid-cols-3 gap-2" aria-label="Loading availability">{[1, 2, 3, 4, 5, 6].map((slot) => <span key={slot} className="h-11 animate-pulse rounded-xl bg-slate-100" />)}</div> : slotsState === "error" ? <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">{slotsError}</div> : availableDays.length === 0 ? <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">No open times in this window. Please change the duration or check back soon.</div> : <>
                <div className="mt-4 grid grid-cols-5 gap-2">{availableDays.map((day) => <button key={day.key} type="button" onClick={() => { setSelectedDay(day.key); setSelectedSlot(""); }} className={`rounded-xl border px-1 py-2.5 text-center transition ${selectedDay === day.key ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50"}`}><span className="block text-[10px] font-bold uppercase tracking-[.08em] opacity-80">{displayDate(day.date.toISOString(), timeZone, { weekday: "short" })}</span><span className="mt-1 block text-lg font-black leading-none">{displayDate(day.date.toISOString(), timeZone, { day: "numeric" })}</span></button>)}</div>
                <div className="mt-4 grid grid-cols-3 gap-2">{selectedDaySlots.map((slot) => <button key={slot.start} type="button" onClick={() => setSelectedSlot(slot.start)} className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition ${selectedSlot === slot.start ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"}`}>{displayDate(slot.start, timeZone, { hour: "numeric", minute: "2-digit" })}</button>)}</div>
              </>}
              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
                <div className="flex items-center justify-between gap-3"><p className="flex items-center gap-2 text-sm font-bold text-slate-800"><CalendarDays className="size-4 text-blue-600" /> {selectedSlot ? displayDate(selectedSlot, timeZone, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Select a time to continue"}</p><Sparkles className="size-4 text-blue-500" /></div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2"><input value={name} onChange={(event) => setName(event.target.value)} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500" placeholder="Your name" /><div className="relative"><Mail className="pointer-events-none absolute left-3 top-3 size-4 text-slate-400" /><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" className="h-10 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500" placeholder="Work email" /></div></div>
                {bookingState === "error" && <p className="mt-2 text-xs font-semibold text-rose-600">{bookingError}</p>}
                <button type="button" disabled={!canConfirm || bookingState === "saving"} onClick={confirmBooking} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-40">{bookingState === "saving" ? "Confirming..." : "Confirm booking"}<ArrowRight className="size-4" /></button>
              </div>
            </div>
          </div>}
        </div>
      </div>
    </section>;
  }

  return <section id="contact" className="border-y border-slate-200 bg-[radial-gradient(circle_at_90%_8%,rgba(59,130,246,.13),transparent_30%),linear-gradient(180deg,#fff,#f7fbff)] px-5 py-6 md:px-8 md:py-8" aria-labelledby="booking-heading">
    <div className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between"><p className="kervox-wordmark text-3xl leading-none">KERVO<span className="kervox-wordmark__accent">X</span></p><p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-700 md:text-xs">Your next stage starts here</p></div>
      <div className="mx-auto mt-5 max-w-3xl text-center"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-700">A more useful demo starts with context</p><h2 id="booking-heading" className="mt-2 text-3xl font-black italic leading-[1.04] tracking-tight text-slate-950 md:text-4xl">One Platform. <span className="text-blue-600">Bigger Possibilities.</span></h2></div>
      <div className="mt-5 rounded-[24px] border border-blue-100 bg-white/90 p-5 pt-3 shadow-[0_28px_80px_rgba(20,73,150,.12)] md:p-7 md:pt-4">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3"><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">1</span><span className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Your context</span></div><div className="flex items-center gap-2"><span className="grid size-7 place-items-center rounded-full bg-slate-100 text-xs font-black text-slate-400">2</span><span className="text-xs font-bold uppercase tracking-[.1em] text-slate-500">Book</span></div></div>
        <div className="grid gap-8 py-6 lg:grid-cols-[.9fr_1.1fr] lg:gap-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Step 1 of 1</p><h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Tell us about your team.</h3>
            <div className="mt-1 grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Your role<input value={role} onChange={(event) => setRole(event.target.value)} className="mt-3 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="Founder, operations, sales..." /></label><div><div className="flex items-baseline justify-between text-sm font-bold text-slate-700"><span>Company size</span><output className="text-blue-700">{teamSizeLabel(teamSize)}</output></div><input aria-label="Company size" type="range" min="1" max="500" step="1" value={teamSize} onChange={(event) => setTeamSize(Number(event.target.value))} className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600" /><div className="mt-1 flex justify-between text-xs font-semibold text-slate-400"><span>1</span><span>500+</span></div></div></div>
            <div className="mt-8"><p className="text-sm font-bold text-slate-700">When are you aiming to make progress?</p><PillPicker items={timelines} value={timeline} onChange={setTimeline} /></div><div className="mt-5"><p className="text-sm font-bold text-slate-700">How are you involved in the decision?</p><PillPicker items={decisions} value={decision} onChange={setDecision} /></div><label className="mt-5 block text-sm font-bold text-slate-700">What is the biggest problem you want to solve?<textarea value={problem} onChange={(event) => setProblem(event.target.value)} rows={1} className="mt-2 h-12 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="E.g. slow applications or scattered data." /></label>
          </div>
          <div className="border-t border-slate-100 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Your priorities</p><h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">What matters most right now?</h3><p className="mt-1 text-sm text-slate-600">Drag your top three into order, or tap a card to add it.</p><div className="mt-4 grid grid-cols-3 gap-2">{[0, 1, 2].map((rank) => <div key={rank} onDragOver={(event) => event.preventDefault()} onDrop={() => drop(rank)} className={`min-h-[62px] rounded-xl border-2 border-dashed p-2 ${focus[rank] ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50"}`}><p className="text-[10px] font-black uppercase tracking-[.1em] text-blue-700">Priority {rank + 1}</p>{focus[rank] ? <div className="mt-1.5 flex justify-between gap-1 text-xs font-bold leading-4 text-slate-900"><span>{focus[rank]}</span><button type="button" aria-label={`Remove ${focus[rank]}`} onClick={() => setFocus((items) => items.filter((item) => item !== focus[rank]))}><X className="size-3.5" /></button></div> : <p className="mt-2 text-xs text-slate-400">Drop here</p>}</div>)}</div><div className="mt-3 grid grid-cols-3 gap-2">{options.map((item) => <button key={item} type="button" draggable onDragStart={() => setDragged(item)} onClick={() => choose(item)} className={`flex min-h-8 items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[11px] font-bold leading-[.875rem] transition ${focus.includes(item) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"}`}><GripVertical className="size-3.5 shrink-0 opacity-60" /><span>{item}</span>{focus.includes(item) && <span className="ml-auto text-[10px]">#{focus.indexOf(item) + 1}</span>}</button>)}</div><div className="mt-4 flex justify-end"><button type="button" disabled={!readyToBook} onClick={() => setStep(1)} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-40">Choose a time <ArrowRight className="size-4" /></button></div></div>
        </div>
      </div>
      <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-5 text-slate-500">Your answers help us prepare a relevant conversation and are used only for your demo request.</p>
    </div>
  </section>;
}
