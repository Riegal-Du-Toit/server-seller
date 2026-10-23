"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, GripVertical, X } from "lucide-react";
import OpenSlotBooking, { type OsbBooking } from "@/components/ui/open-slot-booking";

const options = [
  "Generate qualified leads",
  "Build better funnels",
  "Digitise applications",
  "Automate approvals",
  "Improve onboarding",
  "Manage customers",
  "Collect payments",
  "Unify reporting",
];

const timelines = ["Exploring", "This quarter", "Next 3 months", "Later this year"];
const decisions = ["I make the decision", "I influence the decision", "I am researching options"];

type PillPickerProps = {
  items: string[];
  value: string;
  onChange: (item: string) => void;
};

function PillPicker({ items, value, onChange }: PillPickerProps) {
  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
            value === item
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

function teamSizeLabel(size: number) {
  return size >= 500 ? "500+ people" : `${size} ${size === 1 ? "person" : "people"}`;
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

  const stepValid = [
    role.trim().length > 1 && Boolean(timeline) && Boolean(decision),
    focus.length === 3 && problem.trim().length > 2,
  ];

  const choose = (item: string) => {
    setFocus((current) => {
      if (current.includes(item)) return current.filter((entry) => entry !== item);
      return current.length < 3 ? [...current, item] : current;
    });
  };

  const drop = (rank: number) => {
    if (!dragged) return;

    setFocus((current) => {
      const withoutDragged = current.filter((item) => item !== dragged);
      return [...withoutDragged.slice(0, rank), dragged, ...withoutDragged.slice(rank)].slice(0, 3);
    });
    setDragged(null);
  };

  const saveBooking = async (booking: OsbBooking) => {
    const message = [
      `Role: ${role}`,
      `Team size: ${teamSizeLabel(teamSize)}`,
      `Priorities: ${focus.join(", ")}`,
      `Biggest problem: ${problem}`,
      `Timeline: ${timeline}`,
      `Decision role: ${decision}`,
      `Meeting: ${booking.start.toISOString()}`,
      booking.note ? `Note: ${booking.note}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const response = await fetch("/api/demo-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: booking.name,
        email: booking.email,
        company: "Not provided during booking",
        phone: "",
        interest: focus.join(", "),
        message,
        consent: "yes",
      }),
    });
    const result = (await response.json().catch(() => ({}))) as { message?: string };
    if (!response.ok) throw new Error(result.message || "We could not save your booking. Please try again.");
  };

  if (step === 2) {
    return (
      <section id="contact" className="border-y border-slate-200 bg-white" aria-label="Book a Kervox platform demo">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 md:px-8">
          <p className="kervox-wordmark text-3xl leading-none">
            KERVO<span className="kervox-wordmark__accent">X</span>
          </p>
          <button type="button" onClick={() => setStep(1)} className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">
            Edit answers
          </button>
        </div>
        <OpenSlotBooking
          headline="Your tailored Kervox session."
          headlineAccent="Choose a time."
          description={`We'll focus on ${focus.join(", ")}. Bring one real workflow and leave with a practical plan.`}
          altContact={null}
          host={{ name: "Kervox Team", role: "Platform specialists", initials: "KX", stamp: "Kervox / book a demo / " }}
          meetingTitle="Kervox platform demo"
          agenda={`We'll focus on ${focus.join(", ").toLowerCase()} and map the best next step for your team.`}
          location="Video call - link sent after booking"
          responseNote="Confirmation sent immediately"
          bookingUrl="kervox.co/book-demo"
          durations={[30, 45]}
          defaultDuration={30}
          hostTimeZone="Africa/Johannesburg"
          hours={{ days: [1, 2, 3, 4, 5], from: "09:00", to: "16:30" }}
          chrome="browser"
          theme="light"
          height="calc(100svh - 52px)"
          gridHeight={420}
          onBook={saveBooking}
          colors={{ slab: "#2563eb", from: "#2563eb", to: "#0ea5e9", fromDark: "#60a5fa", toDark: "#38bdf8", action: "#2563eb", window: "#102b45" }}
        />
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="border-y border-slate-200 bg-[radial-gradient(circle_at_90%_8%,rgba(59,130,246,.13),transparent_30%),linear-gradient(180deg,#fff,#f7fbff)] px-5 py-6 md:px-8 md:py-8"
      aria-labelledby="booking-heading"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <p className="kervox-wordmark text-3xl leading-none">
            KERVO<span className="kervox-wordmark__accent">X</span>
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-blue-700 md:text-xs">Your next stage starts here</p>
        </div>

        <div className="mx-auto mt-5 max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-blue-700">A more useful demo starts with context</p>
          <h2 id="booking-heading" className="mt-2 text-3xl font-black italic leading-[1.04] tracking-tight text-slate-950 md:text-4xl">
            One Platform. <span className="text-blue-600">Bigger Possibilities.</span>
          </h2>
        </div>

        <div className="mt-5 rounded-[24px] border border-blue-100 bg-white/90 p-5 shadow-[0_28px_80px_rgba(20,73,150,.12)] md:p-7">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
            {["Your business", "Priorities", "Book"].map((label, index) => (
              <div key={label} className="flex items-center gap-2">
                <span className={`grid size-7 place-items-center rounded-full text-xs font-black ${index <= step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {index < step ? <Check className="size-4" /> : index + 1}
                </span>
                <span className="hidden text-xs font-bold uppercase tracking-[.1em] text-slate-500 sm:block">{label}</span>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-3xl py-6">
            {step === 0 && (
              <>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Step 1 of 2</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Tell us about your team.</h3>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <label className="text-sm font-bold text-slate-700">
                    Your role
                    <input
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                      placeholder="Founder, operations, sales..."
                    />
                  </label>
                  <div>
                    <div className="flex items-baseline justify-between text-sm font-bold text-slate-700">
                      <span>Company size</span>
                      <output className="text-blue-700">{teamSizeLabel(teamSize)}</output>
                    </div>
                    <input
                      aria-label="Company size"
                      type="range"
                      min="1"
                      max="500"
                      step="1"
                      value={teamSize}
                      onChange={(event) => setTeamSize(Number(event.target.value))}
                      className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-blue-600"
                    />
                    <div className="mt-1 flex justify-between text-xs font-semibold text-slate-400"><span>1</span><span>500+</span></div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-bold text-slate-700">When are you aiming to make progress?</p>
                    <PillPicker items={timelines} value={timeline} onChange={setTimeline} />
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-bold text-slate-700">How are you involved in the decision?</p>
                    <PillPicker items={decisions} value={decision} onChange={setDecision} />
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-blue-700">Step 2 of 2</p>
                <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">What matters most right now?</h3>
                <p className="mt-1 text-sm text-slate-600">Drag your top three into order, or tap a card to add it.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[0, 1, 2].map((rank) => (
                    <div
                      key={rank}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => drop(rank)}
                      className={`min-h-24 rounded-2xl border-2 border-dashed p-3 ${focus[rank] ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50"}`}
                    >
                      <p className="text-[11px] font-black uppercase tracking-[.12em] text-blue-700">Priority {rank + 1}</p>
                      {focus[rank] ? (
                        <div className="mt-2 flex justify-between gap-2 text-sm font-bold text-slate-900">
                          <span>{focus[rank]}</span>
                          <button type="button" aria-label={`Remove ${focus[rank]}`} onClick={() => setFocus((items) => items.filter((item) => item !== focus[rank]))}>
                            <X className="size-4" />
                          </button>
                        </div>
                      ) : <p className="mt-3 text-sm text-slate-400">Drop here</p>}
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {options.map((item) => (
                    <button
                      key={item}
                      type="button"
                      draggable
                      onDragStart={() => setDragged(item)}
                      onClick={() => choose(item)}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-bold transition ${focus.includes(item) ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50"}`}
                    >
                      <GripVertical className="size-4 opacity-60" />
                      {item}
                      {focus.includes(item) && <span className="ml-auto text-xs">#{focus.indexOf(item) + 1}</span>}
                    </button>
                  ))}
                </div>
                <label className="mt-5 block text-sm font-bold text-slate-700">
                  What is the biggest problem you want to solve?
                  <textarea
                    value={problem}
                    onChange={(event) => setProblem(event.target.value)}
                    rows={2}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    placeholder="For example: applications take too long or data is split across systems."
                  />
                </label>
              </>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            {step ? (
              <button type="button" onClick={() => setStep(0)} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100">
                <ArrowLeft className="size-4" />Back
              </button>
            ) : <span />}
            <button
              type="button"
              disabled={!stepValid[step]}
              onClick={() => setStep(step + 1)}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 1 ? "Choose a time" : "Continue"} <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <p className="mx-auto mt-3 max-w-2xl text-center text-xs leading-5 text-slate-500">Your answers help us prepare a relevant conversation and are used only for your demo request.</p>
      </div>
    </section>
  );
}