"use client";

import { useState, useRef, useEffect } from "react";
import { translations, type Lang } from "../translations";

// ─── Phase colors ─────────────────────────────────────────────────────────────

const PHASE_COLORS = {
  blue:   { bg: "bg-blue-500/10",    border: "border-blue-500/25",    text: "text-blue-400"    },
  violet: { bg: "bg-violet-500/10",  border: "border-violet-500/25",  text: "text-violet-400"  },
  emerald:{ bg: "bg-emerald-500/10", border: "border-emerald-500/25", text: "text-emerald-400" },
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconTicket() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
    </svg>
  );
}
function IconZap() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
    </svg>
  );
}
function IconGear() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/>
    </svg>
  );
}
function IconCode() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
    </svg>
  );
}
function IconStamp() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  );
}

const STEP_ICONS = [IconTicket, IconZap, IconGear, IconCode, IconStamp, IconMail];

// ─── Pipeline node ────────────────────────────────────────────────────────────

function PipelineNode({ label, sublabel, colorBg, colorBorder, colorText, icon }: {
  label: string; sublabel: string;
  colorBg: string; colorBorder: string; colorText: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`flex flex-col items-center gap-3 px-5 py-4 rounded-2xl border ${colorBorder} ${colorBg} min-w-[128px]`}>
      <div className={colorText}>{icon}</div>
      <div className="text-center">
        <p className="text-white text-[14px] font-syne font-600 tracking-tight">{label}</p>
        <p className={`text-[12px] font-dm mt-1 ${colorText}`}>{sublabel}</p>
      </div>
    </div>
  );
}

// ─── Animated flow arrow ──────────────────────────────────────────────────────

function FlowArrow({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 shrink-0 mx-1">
      <span className="text-[11px] font-dm text-white/55 whitespace-nowrap tracking-wide">{label}</span>
      <svg width="72" height="14" viewBox="0 0 72 14">
        <line x1="0" y1="7" x2="60" y2="7"
          stroke="rgba(255,255,255,0.30)" strokeWidth="1.5" strokeDasharray="5 4"
          className="flow-line"
        />
        <path d="M58 3 L68 7 L58 11" fill="none" stroke="rgba(255,255,255,0.40)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── Lang selector (mirrors main page) ───────────────────────────────────────

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 text-white/30 pointer-events-none ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const LANG_LABEL: Record<Lang, string> = { pt: "PT", en: "EN", es: "ES" };

function FlagPT() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" className="rounded-[1px] shrink-0">
      <rect width="8" height="14" fill="#006600"/>
      <rect x="8" width="12" height="14" fill="#D52B1E"/>
      <circle cx="8" cy="7" r="3" fill="#FFD700" opacity="0.9"/>
      <circle cx="8" cy="7" r="2.1" fill="#006600"/>
      <circle cx="8" cy="7" r="1.2" fill="#FFD700" opacity="0.8"/>
    </svg>
  );
}
function FlagGB() {
  return (
    <svg width="20" height="14" viewBox="0 0 60 30" className="rounded-[1px] shrink-0">
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="white" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 V30 M0,15 H60" stroke="white" strokeWidth="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  );
}
function FlagES() {
  return (
    <svg width="20" height="14" viewBox="0 0 3 2" className="rounded-[1px] shrink-0">
      <rect width="3" height="2" fill="#c60b1e"/>
      <rect y="0.5" width="3" height="1" fill="#ffc400"/>
    </svg>
  );
}
const LANG_FLAG: Record<Lang, React.ReactNode> = { pt: <FlagPT />, en: <FlagGB />, es: <FlagES /> };

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative z-[60]">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] transition-all text-sm text-white/60 hover:text-white font-dm">
        {LANG_FLAG[lang]}
        <span className="font-medium tracking-wide">{LANG_LABEL[lang]}</span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-28 bg-[#0e1220] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
          {(["pt", "en", "es"] as Lang[]).map(l => (
            <button key={l} type="button"
              onMouseDown={(e) => { e.preventDefault(); onChange(l); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-dm transition-colors ${lang === l ? "bg-blue-600/15 text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white"}`}>
              {LANG_FLAG[l]}
              <span className="font-medium">{LANG_LABEL[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HowItWorks() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];

  const STEPS = [
    { phase: "blue"    as const, title: t.step01Title, actor: t.step01Actor, desc: t.step01Desc },
    { phase: "blue"    as const, title: t.step02Title, actor: t.step02Actor, desc: t.step02Desc },
    { phase: "violet"  as const, title: t.step03Title, actor: t.step03Actor, desc: t.step03Desc },
    { phase: "violet"  as const, title: t.step04Title, actor: t.step04Actor, desc: t.step04Desc },
    { phase: "emerald" as const, title: t.step05Title, actor: t.step05Actor, desc: t.step05Desc },
    { phase: "emerald" as const, title: t.step06Title, actor: t.step06Actor, desc: t.step06Desc },
  ];

  return (
    <>
      <style>{`
        @keyframes flowAnim { to { stroke-dashoffset: -18; } }
        .flow-line { animation: flowAnim 1.2s linear infinite; }
        @keyframes pulseGlow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        .pulse-dot { animation: pulseGlow 2s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen dot-bg vignette relative font-dm bg-[#07090e]">
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-blue-600/[0.04] blur-[100px] rounded-full pointer-events-none z-0" />

        {/* Demo banner */}
        <div className="relative z-30 flex items-center justify-center gap-2 px-4 py-1.5 bg-amber-500/[0.06] border-b border-amber-500/[0.12]">
          <svg className="w-3 h-3 text-amber-400/60 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          </svg>
          <span className="text-[11px] font-dm text-amber-400/60">
            Demo — Internal use only. Integration visuals and parameters may vary.
          </span>
        </div>

        {/* Header */}
        <header className="relative z-20 flex items-center justify-between px-8 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-[30px] h-[30px] rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-600/30 shrink-0">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <div className="flex flex-col gap-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <a href="https://kapta.pt/" target="_blank" rel="noopener noreferrer" className="group w-fit">
                <img src="/logo-kapta-white.png" alt="Kapta" className="h-[15px] w-auto object-contain opacity-55 group-hover:opacity-90 transition-all duration-200" />
              </a>
              <span className="font-syne font-600 text-white/60 text-[12px] tracking-tight leading-none">Integration Hub</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="/" className="text-sm font-dm text-white/30 hover:text-white/60 transition-colors">
              {t.backToDashboard}
            </a>
            <LangSelector lang={lang} onChange={setLang} />
          </div>
        </header>

        <main className="relative z-10 px-6 py-16 max-w-5xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-16 fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-dm font-medium mb-6">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              {t.howItWorksBadge}
            </div>
            <h1 className="font-syne font-700 text-4xl text-white mb-4 tracking-tight leading-tight whitespace-pre-line">
              {t.howItWorksTitle}
            </h1>
            <p className="text-white/40 text-[15px] leading-relaxed font-dm max-w-md mx-auto">
              {t.howItWorksSubtitle}
            </p>
          </div>

          {/* Pipeline diagram */}
          <div className="mb-16 fade-up" style={{ animationDelay: "60ms" }}>
            <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/[0.03] via-violet-600/[0.03] to-emerald-600/[0.03] pointer-events-none" />

              <p className="text-[11px] font-dm font-medium text-white/40 uppercase tracking-widest text-center mb-10">
                {t.pipelineTitle}
              </p>

              <div className="flex items-center justify-center flex-nowrap px-2">
                {/* FareHarbor node */}
                <div className="flex flex-col items-center gap-3 px-5 py-4 rounded-2xl border border-[#0069b5]/35 bg-[#0069b5]/10 min-w-[128px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/fareharbor-logo.svg" alt="FareHarbor" className="w-7 h-7 object-contain"
                    style={{ filter: "invert(35%) sepia(90%) saturate(600%) hue-rotate(190deg) brightness(110%)" }}
                  />
                  <div className="text-center">
                    <p className="text-white text-[14px] font-syne font-600 tracking-tight">FareHarbor</p>
                    <p className="text-[12px] font-dm mt-1 text-[#4da8e0]">{t.nodeBookingPlatform}</p>
                  </div>
                </div>

                <FlowArrow label={t.arrowBookingData} />

                <PipelineNode label="Kapta" sublabel={t.nodeIntegrationEngine}
                  colorBg="bg-blue-500/10" colorBorder="border-blue-500/25" colorText="text-blue-400"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                />

                <FlowArrow label={t.arrowInvoiceRequest} />

                <PipelineNode label={t.invoicingSoftware} sublabel={t.nodeBillingApps}
                  colorBg="bg-violet-500/10" colorBorder="border-violet-500/25" colorText="text-violet-400"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
                />

                <FlowArrow label={t.arrowFiscalDoc} />

                <PipelineNode label={t.nodeCustomer} sublabel={t.nodeAutoDelivery}
                  colorBg="bg-emerald-500/10" colorBorder="border-emerald-500/25" colorText="text-emerald-400"
                  icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>}
                />
              </div>

              {/* Phase legend */}
              <div className="flex items-center justify-center gap-6 mt-8">
                {[
                  { color: "bg-[#0069b5]", label: t.legendFH },
                  { color: "bg-blue-500",   label: t.legendKapta },
                  { color: "bg-violet-500", label: t.legendBilling },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full pulse-dot ${color}`} />
                    <span className="text-[11px] font-dm text-white/35">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Steps grid */}
          <div className="mb-10">
            <p className="text-[11px] font-dm font-medium text-white/25 uppercase tracking-widest text-center mb-8">
              {t.stepByStep}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {STEPS.map((step, i) => {
                const Icon = STEP_ICONS[i];
                const c = PHASE_COLORS[step.phase];
                const n = String(i + 1).padStart(2, "0");
                return (
                  <div key={i} className={`fade-up rounded-2xl border ${c.border} bg-white/[0.025] p-5 relative overflow-hidden`}
                    style={{ animationDelay: `${i * 60 + 120}ms` }}>
                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full pointer-events-none ${c.bg}`} />
                    <div className="flex items-start gap-4">
                      <div className={`w-9 h-9 rounded-xl border shrink-0 flex items-center justify-center ${c.bg} ${c.border} ${c.text}`}>
                        <Icon />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-dm font-medium tracking-widest ${c.text} opacity-70`}>{n}</span>
                          <span className="text-[10px] font-dm text-white/25 uppercase tracking-wider truncate">{step.actor}</span>
                        </div>
                        <h3 className="font-syne font-600 text-white text-[14px] tracking-tight mb-2">{step.title}</h3>
                        <p className="text-[12px] font-dm text-white/40 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key facts */}
          <div className="fade-up" style={{ animationDelay: "480ms" }}>
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-8">
              <p className="text-[11px] font-dm font-medium text-white/25 uppercase tracking-widest text-center mb-6">
                {t.keyFacts}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                {[
                  { value: "< 2s",  label: t.fact1Label, color: "text-blue-400"    },
                  { value: "100%",  label: t.fact2Label, color: "text-violet-400"  },
                  { value: "EU",    label: t.fact3Label, color: "text-emerald-400" },
                ].map(({ value, label, color }) => (
                  <div key={value}>
                    <p className={`font-syne font-700 text-3xl tracking-tight mb-1 ${color}`}>{value}</p>
                    <p className="text-[12px] font-dm text-white/35">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
}
