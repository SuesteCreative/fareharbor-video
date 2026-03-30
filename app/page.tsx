"use client";

import { useState } from "react";
import { translations, type Lang } from "./translations";
import { EU_COUNTRIES, getExemptions } from "./eu-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type ValidationState = "idle" | "validating" | "valid" | "invalid";
type Country = "pt" | "es";
type SoftwareId = "invoicexpress" | "moloni" | "billin" | "holded";

// ─── Software catalogue ───────────────────────────────────────────────────────

const BILLING_SOFTWARE: Record<Country, { id: SoftwareId; name: string; logo: string }[]> = {
  pt: [
    { id: "invoicexpress", name: "InvoiceXpress", logo: "/invoicexpress-logo.svg" },
    { id: "moloni",        name: "Moloni",         logo: "/moloni.logo.svg"        },
  ],
  es: [
    { id: "billin", name: "Billin", logo: "/billin-logo.png" },
    { id: "holded", name: "Holded", logo: "/holded-logo.svg" },
  ],
};

// ─── Validation hook ──────────────────────────────────────────────────────────

function useFieldValidation() {
  const [state, setState] = useState<ValidationState>("idle");
  const validate = (v: string) => {
    if (!v) { setState("idle"); return; }
    setState("validating");
    setTimeout(() => setState(v.length >= 6 ? "valid" : "invalid"), 850);
  };
  const reset = () => setState("idle");
  return { state, validate, reset };
}

// ─── Input class ──────────────────────────────────────────────────────────────

function inputCls(state: ValidationState, disabled?: boolean) {
  const base = `w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200 pr-10 font-dm ${
    disabled ? "opacity-40 cursor-not-allowed bg-white/[0.02] border border-white/[0.06]" : "bg-white/[0.04] border"
  }`;
  if (state === "valid")   return `${base} border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/30`;
  if (state === "invalid") return `${base} border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-500/20`;
  return `${base} border-white/[0.09] focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20`;
}

const selectCls = "w-full appearance-none bg-white/[0.04] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 cursor-pointer pr-8 font-dm";

// ─── Small components ─────────────────────────────────────────────────────────

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 text-white/30 pointer-events-none ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ValidationIcon({ state }: { state: ValidationState }) {
  if (state === "validating")
    return <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg></span>;
  if (state === "valid")
    return <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></span>;
  if (state === "invalid")
    return <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg></span>;
  return null;
}

function VerifiedBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-dm font-medium">
      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
      {label}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <div className="relative group inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-72 p-3 bg-[#0e1220] border border-white/[0.1] rounded-xl text-[11px] text-white/65 font-dm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-50 shadow-2xl">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-[#0e1220]" />
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-white/25 cursor-help hover:text-white/50 transition-colors" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
    </svg>
  );
}

// ─── Country dropdown (billing panel) ────────────────────────────────────────

const COUNTRY_OPTIONS = [
  { code: "pt" as const, flag: "🇵🇹", locked: false },
  { code: "es" as const, flag: "🇪🇸", locked: false },
  { code: "it",          flag: "🇮🇹", locked: true  },
  { code: "fr",          flag: "🇫🇷", locked: true  },
  { code: "de",          flag: "🇩🇪", locked: true  },
];

type CountryOption = typeof COUNTRY_OPTIONS[number];

function CountryDropdown({
  value, onChange, disabled, t
}: {
  value: Country | "";
  onChange: (c: Country) => void;
  disabled?: boolean;
  t: { selectPlaceholder: string; portugal: string; spain: string; italy: string; france: string; germany: string; comingSoon: string };
}) {
  const [open, setOpen] = useState(false);
  const LABELS: Record<string, string> = { pt: t.portugal, es: t.spain, it: t.italy, fr: t.france, de: t.germany };
  const selected = COUNTRY_OPTIONS.find(c => c.code === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border text-sm font-dm transition-all duration-200 ${
          disabled ? "opacity-40 cursor-not-allowed bg-white/[0.02] border-white/[0.06] text-white/40" :
          open ? "bg-white/[0.06] border-blue-500/70 ring-1 ring-blue-500/20 text-white" :
          "bg-white/[0.04] border-white/[0.09] text-white/80 hover:border-white/20 hover:bg-white/[0.06]"
        }`}
      >
        <span className="flex items-center gap-2">
          {selected ? (
            <><span className="text-base">{selected.flag}</span><span>{LABELS[selected.code]}</span></>
          ) : (
            <span className="text-white/30">{t.selectPlaceholder}</span>
          )}
        </span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0e1220] border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl z-50">
          {COUNTRY_OPTIONS.map((opt: CountryOption) => (
            <button
              key={opt.code}
              type="button"
              onClick={() => {
                if (!opt.locked) {
                  onChange(opt.code as Country);
                  setOpen(false);
                }
              }}
              disabled={opt.locked}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-dm transition-colors text-left ${
                opt.locked
                  ? "text-white/25 cursor-not-allowed"
                  : value === opt.code
                  ? "bg-blue-600/15 text-white"
                  : "text-white/60 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="text-base">{opt.flag}</span>
              <span className="flex-1">{LABELS[opt.code]}</span>
              {opt.locked && (
                <span className="text-[10px] font-dm text-white/20 italic">{t.comingSoon}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label, type = "text", value, onChange, placeholder, validation, disabled, hint, tooltip
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  validation: ReturnType<typeof useFieldValidation>;
  disabled?: boolean; hint?: string; tooltip?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="block text-[11px] font-dm font-medium text-white/40 uppercase tracking-wider">{label}</label>
        {tooltip && <Tooltip content={tooltip}><InfoIcon /></Tooltip>}
      </div>
      <div className="relative">
        <input
          type={type} value={value}
          onChange={(e) => { onChange(e.target.value); validation.validate(e.target.value); }}
          placeholder={placeholder}
          className={inputCls(validation.state, disabled)}
          disabled={disabled}
        />
        <ValidationIcon state={validation.state} />
      </div>
      {hint && validation.state === "valid" && <p className="text-[11px] text-emerald-400/80 mt-1 font-dm">{hint}</p>}
      {validation.state === "invalid" && <p className="text-[11px] text-red-400/80 mt-1 font-dm">Mínimo 6 caracteres</p>}
    </div>
  );
}

// ─── Lang selector ────────────────────────────────────────────────────────────

const FLAG: Record<Lang, string>  = { pt: "🇵🇹", en: "🇬🇧", es: "🇪🇸" };
const LABEL: Record<Lang, string> = { pt: "PT",   en: "EN",   es: "ES"   };

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-50">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] transition-all text-sm text-white/60 hover:text-white font-dm">
        <span className="text-base leading-none">{FLAG[lang]}</span>
        <span className="font-medium tracking-wide">{LABEL[lang]}</span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-28 bg-[#0e1220] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
          {(["pt", "en", "es"] as Lang[]).map((l) => (
            <button key={l} onClick={() => { onChange(l); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-dm transition-colors ${lang === l ? "bg-blue-600/15 text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white"}`}>
              <span>{FLAG[l]}</span><span className="font-medium">{LABEL[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function Steps({ current, t }: { current: "configure" | "parameters" | "done"; t: { credentials: string; parameters: string; done: string } }) {
  const steps = [{ id: "configure", label: t.credentials }, { id: "parameters", label: t.parameters }, { id: "done", label: t.done }];
  const idx = steps.findIndex(s => s.id === current);
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => {
        const done = i < idx; const active = s.id === current;
        return (
          <div key={s.id} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${done ? "bg-emerald-500" : active ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" : "bg-white/15"}`} />
              <span className={`text-[9px] font-dm font-medium tracking-wide uppercase ${active ? "text-white/60" : done ? "text-emerald-500/60" : "text-white/18"}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className="w-6 h-px bg-white/[0.08] mb-3" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Invoice SVG (landing page right side) ───────────────────────────────────

function LargeInvoiceIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="4" width="36" height="46" rx="4" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8"/>
      <path d="M8 4h20l16 16v30a4 4 0 01-4 4H12a4 4 0 01-4-4V8a4 4 0 014-4z" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" fill="none"/>
      <path d="M28 4v12a2 2 0 002 2h12" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
      <line x1="14" y1="28" x2="38" y2="28" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="14" y1="34" x2="38" y2="34" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="14" y1="40" x2="28" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="42" cy="42" r="10" fill="#1d4ed8" opacity="0.9"/>
      <path d="M42 37v1.5M42 44.5V46M39 40.5a2 2 0 011.5-1.5H43a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3h1.5a2 2 0 011.5 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ─── Small invoice icon (billing panel) ──────────────────────────────────────

function InvoiceDocIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="8" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8" y1="16" x2="16" y2="16" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="8" y1="19" x2="12" y2="19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [lang, setLang]   = useState<Lang>("pt");
  const [step, setStep]   = useState<"initial" | "configure" | "parameters" | "done">("initial");
  const t = translations[lang];

  // FareHarbor
  const [fhShortName, setFhShortName] = useState("");
  const [fhApiKey,    setFhApiKey]    = useState("");
  const fhShortNameV = useFieldValidation();
  const fhApiKeyV    = useFieldValidation();

  // Billing
  const [billCountry,  setBillCountry]  = useState<Country | "">("");
  const [billSoftware, setBillSoftware] = useState<SoftwareId | "">("");
  const [billCompany,  setBillCompany]  = useState("");
  const [billApiKey,   setBillApiKey]   = useState("");
  const billCompanyV = useFieldValidation();
  const billApiKeyV  = useFieldValidation();

  // Invoice params
  const [invoiceType,   setInvoiceType]   = useState("");
  const [vatCountry,    setVatCountry]    = useState("");
  const [taxRate,       setTaxRate]       = useState("");
  const [intlTax,       setIntlTax]       = useState(false);
  const [exemptReason,  setExemptReason]  = useState("");
  const [ossEnabled,    setOssEnabled]    = useState(false);
  const [autoFinalize,  setAutoFinalize]  = useState("");

  const selectCountry = (c: Country) => {
    setBillCountry(c); setBillSoftware("");
    setBillCompany(""); billCompanyV.reset();
    setBillApiKey("");  billApiKeyV.reset();
  };

  const selectSoftware = (id: SoftwareId) => {
    setBillSoftware(id);
    setBillCompany(""); billCompanyV.reset();
    setBillApiKey("");  billApiKeyV.reset();
  };

  const handleVatCountryChange = (code: string) => {
    setVatCountry(code);
    const country = EU_COUNTRIES.find(c => c.code === code);
    if (country) setTaxRate(String(country.vatRate));
    setExemptReason("");
  };

  const fhValid   = fhShortNameV.state === "valid" && fhApiKeyV.state === "valid";
  const billValid = billCountry !== "" && billSoftware !== "" && billCompanyV.state === "valid" && billApiKeyV.state === "valid";
  const canContinue = fhValid && billValid;
  const canFinish   = invoiceType !== "" && taxRate !== "" && autoFinalize !== "";

  const handleReset = () => {
    setStep("initial");
    setFhShortName(""); setFhApiKey(""); fhShortNameV.reset(); fhApiKeyV.reset();
    setBillCountry(""); setBillSoftware(""); setBillCompany(""); setBillApiKey("");
    billCompanyV.reset(); billApiKeyV.reset();
    setInvoiceType(""); setVatCountry(""); setTaxRate(""); setIntlTax(false);
    setExemptReason(""); setOssEnabled(false); setAutoFinalize("");
  };

  const softwareOptions  = billCountry ? BILLING_SOFTWARE[billCountry] : [];
  const selectedSoftware = softwareOptions.find(s => s.id === billSoftware);
  const exemptions       = getExemptions(billCountry);

  const invoiceTypeLabel = (v: string) =>
    v === "fatura-recibo" ? t.faturaRecibo : v === "simplified" ? t.simplifiedInvoice : t.fatura;

  return (
    <div className="min-h-screen dot-bg vignette relative font-dm bg-[#07090e]">
      {/* ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-blue-600/[0.04] blur-[100px] rounded-full pointer-events-none z-0" />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/[0.06]">
        {/* Left: Kapta logo → kapta.pt */}
        <a
          href="https://kapta.pt/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center group"
          title="kapta.pt"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-kapta-white.png"
            alt="Kapta"
            className="h-7 w-auto object-contain transition-all duration-200 opacity-75 group-hover:opacity-100 group-hover:scale-105"
          />
        </a>

        {/* Center/Right: steps + lang */}
        <div className="flex items-center gap-5">
          {step !== "initial" && <Steps current={step === "done" ? "done" : step} t={t.steps} />}
          <LangSelector lang={lang} onChange={setLang} />
        </div>
      </header>

      {/* ── Content ── */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-61px)] px-6 py-12">

        {/* ══ INITIAL ══ */}
        {step === "initial" && (
          <div className="flex flex-col items-center gap-10 fade-up max-w-xl w-full text-center">
            {/* Logo bridge — 3-column grid for perfect centering */}
            <div className="grid grid-cols-3 items-center w-full max-w-sm gap-0">
              {/* FH left */}
              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fareharbor-logo.svg"
                  alt="FareHarbor"
                  className="h-16 w-16 object-contain"
                  style={{ filter: "brightness(0) invert(1) opacity(0.88)" }}
                />
                <span className="text-[10px] text-white/30 font-dm uppercase tracking-widest">FareHarbor</span>
              </div>

              {/* Center arrow — dead center col */}
              <div className="flex justify-center">
                <div className="w-7 h-7 rounded-full border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
              </div>

              {/* Invoice SVG right */}
              <div className="flex flex-col items-center gap-2">
                <LargeInvoiceIcon />
                <span className="text-[10px] text-white/30 font-dm uppercase tracking-widest">{t.invoicingSoftware}</span>
              </div>
            </div>

            <div>
              <h1 className="font-syne font-700 text-4xl text-white mb-3 tracking-tight">{t.pageTitle}</h1>
              <p className="text-white/45 text-[15px] leading-relaxed font-dm max-w-sm mx-auto">{t.pageSubtitle}</p>
            </div>

            <button
              onClick={() => setStep("configure")}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-syne font-600 text-sm rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 hover:-translate-y-0.5 tracking-wide"
            >
              {t.startButton}
            </button>
          </div>
        )}

        {/* ══ CONFIGURE / PARAMETERS ══ */}
        {(step === "configure" || step === "parameters") && (
          <div className="w-full max-w-5xl fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

              {/* ── FareHarbor panel ── */}
              <div className={`rounded-2xl p-6 border transition-all duration-500 bg-white/[0.025] ${fhValid ? "card-valid" : "border-white/[0.07]"}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0069b5]/10 border border-[#0069b5]/20 flex items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/fareharbor-logo.svg" alt="FareHarbor" className="w-full h-full object-contain"
                        style={{ filter: "invert(35%) sepia(90%) saturate(600%) hue-rotate(190deg) brightness(110%)" }} />
                    </div>
                    <div>
                      <h2 className="font-syne font-600 text-white text-[15px]">{t.fareharbor}</h2>
                      <p className="text-white/35 text-xs font-dm mt-0.5">{t.fareharborSubtitle}</p>
                    </div>
                  </div>
                  {fhValid && <VerifiedBadge label={t.verified} />}
                </div>
                <div className="space-y-4">
                  <Field label={t.shortName} value={fhShortName} onChange={setFhShortName}
                    placeholder={t.shortNamePlaceholder} validation={fhShortNameV}
                    disabled={step === "parameters"} hint={t.shortNameValid} />
                  <Field label={t.apiKey} type="password" value={fhApiKey} onChange={setFhApiKey}
                    placeholder={t.apiKeyPlaceholder} validation={fhApiKeyV}
                    disabled={step === "parameters"} hint={t.apiKeyValid} />
                </div>
              </div>

              {/* ── Invoicing Software panel ── */}
              <div className={`rounded-2xl p-6 border transition-all duration-500 bg-white/[0.025] ${billValid ? "card-valid" : "border-white/[0.07]"}`}>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/8 border border-blue-500/15 flex items-center justify-center text-blue-400">
                      <InvoiceDocIcon size={22} />
                    </div>
                    <div>
                      <h2 className="font-syne font-600 text-white text-[15px]">{t.invoicingSoftware}</h2>
                      <p className="text-white/35 text-xs font-dm mt-0.5">{t.invoicingSoftwareSubtitle}</p>
                    </div>
                  </div>
                  {billValid && <VerifiedBadge label={t.verified} />}
                </div>

                {/* Country dropdown */}
                <div className="mb-4">
                  <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.selectCountry}</label>
                  <CountryDropdown value={billCountry} onChange={selectCountry} disabled={step === "parameters"} t={t} />
                </div>

                {/* Software cards */}
                {billCountry && (
                  <div className="mb-4 fade-up">
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-2 uppercase tracking-wider">{t.selectSoftware}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {softwareOptions.map((sw) => (
                        <button key={sw.id} type="button"
                          onClick={() => step !== "parameters" && selectSoftware(sw.id)}
                          disabled={step === "parameters"}
                          className={`sw-card flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border ${
                            billSoftware === sw.id ? "selected" : "border-white/[0.07] bg-white/[0.02]"
                          } ${step === "parameters" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sw.logo} alt={sw.name} className="h-7 w-auto object-contain max-w-[90px]" />
                          <span className="text-[11px] font-dm font-medium text-white/60">{sw.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fields */}
                {selectedSoftware && (
                  <div className="space-y-3 fade-up">
                    <Field label={t.companyName} value={billCompany} onChange={setBillCompany}
                      placeholder={t.companyNamePlaceholder} validation={billCompanyV}
                      disabled={step === "parameters"} hint={t.companyNameValid} />
                    <Field label={t.apiKey} type="password" value={billApiKey} onChange={setBillApiKey}
                      placeholder={t.apiKeyPlaceholder} validation={billApiKeyV}
                      disabled={step === "parameters"} hint={t.apiKeyValid} />
                  </div>
                )}

                {/* Placeholder hints */}
                {!billCountry && (
                  <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-white/[0.07] mt-2">
                    <p className="text-white/20 text-xs font-dm">{t.selectCountryFirst}</p>
                  </div>
                )}
                {billCountry && !billSoftware && (
                  <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-white/[0.07] mt-2">
                    <p className="text-white/20 text-xs font-dm">{t.selectSoftwareFirst}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Invoice parameters ── */}
            {step === "parameters" && (
              <div className="rounded-2xl p-6 border border-white/[0.07] bg-white/[0.025] mb-5 fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-syne font-600 text-white text-[15px]">{t.invoiceParams}</h2>
                    <p className="text-white/35 text-xs font-dm mt-0.5">{t.invoiceParamsSubtitle}</p>
                  </div>
                </div>

                {/* Row 1: doc type + vat country + vat rate + auto-finalize */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {/* Document type */}
                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.documentType}</label>
                    <div className="relative">
                      <select value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)} className={selectCls}>
                        <option value="" disabled className="bg-[#111520]">{t.selectPlaceholder}</option>
                        <option value="fatura"        className="bg-[#111520]">{t.fatura}</option>
                        <option value="fatura-recibo" className="bg-[#111520]">{t.faturaRecibo}</option>
                        <option value="simplified"    className="bg-[#111520]">{t.simplifiedInvoice}</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></span>
                    </div>
                  </div>

                  {/* VAT Country */}
                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.vatCountry}</label>
                    <div className="relative">
                      <select value={vatCountry} onChange={(e) => handleVatCountryChange(e.target.value)} className={selectCls}>
                        <option value="" className="bg-[#111520]">{t.vatCountryPlaceholder}</option>
                        {EU_COUNTRIES.map(c => (
                          <option key={c.code} value={c.code} className="bg-[#111520]">
                            {c.name[lang]} ({c.vatRate}%)
                          </option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></span>
                    </div>
                  </div>

                  {/* VAT Rate */}
                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.defaultTaxRate}</label>
                    <div className="relative">
                      <input type="number" value={taxRate} onChange={(e) => setTaxRate(e.target.value)}
                        placeholder="23" min="0" max="100"
                        className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none font-dm transition-all duration-200 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 pr-8" />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/25 font-dm pointer-events-none">%</span>
                    </div>
                  </div>

                  {/* Auto-finalize */}
                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.autoFinalize}</label>
                    <div className="relative">
                      <select value={autoFinalize} onChange={(e) => setAutoFinalize(e.target.value)} className={selectCls}>
                        <option value="" disabled className="bg-[#111520]">{t.selectPlaceholder}</option>
                        <option value="yes" className="bg-[#111520]">{t.yes}</option>
                        <option value="no"  className="bg-[#111520]">{t.no}</option>
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></span>
                    </div>
                  </div>
                </div>

                {/* Row 2: exempt reason + OSS + intl tax */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Exempt reason */}
                  <div className="sm:col-span-1">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="block text-[11px] font-dm font-medium text-white/40 uppercase tracking-wider">{t.exemptReason}</label>
                      <Tooltip content={t.exemptReasonTooltip}><InfoIcon /></Tooltip>
                    </div>
                    <div className="relative">
                      <select value={exemptReason} onChange={(e) => setExemptReason(e.target.value)} className={selectCls}>
                        <option value="" className="bg-[#111520]">{t.exemptReasonPlaceholder}</option>
                        {exemptions.map(r => (
                          <option key={r.code} value={r.code} className="bg-[#111520]">{r.label}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></span>
                    </div>
                  </div>

                  {/* OSS */}
                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.oss}</label>
                    <div className="flex items-center gap-2.5 h-[42px]">
                      <button type="button" onClick={() => setOssEnabled(!ossEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${ossEnabled ? "bg-blue-600" : "bg-white/[0.1]"}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${ossEnabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                      </button>
                      <span className={`text-sm font-dm font-medium transition-colors ${ossEnabled ? "text-blue-400" : "text-white/25"}`}>
                        {ossEnabled ? t.ossActive : t.ossInactive}
                      </span>
                    </div>
                  </div>

                  {/* International tax */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="block text-[11px] font-dm font-medium text-white/40 uppercase tracking-wider">{t.internationalTax}</label>
                      <Tooltip content={t.internationalTaxTooltip}><InfoIcon /></Tooltip>
                    </div>
                    <div className="flex items-center gap-2.5 h-[42px]">
                      <button type="button" onClick={() => setIntlTax(!intlTax)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${intlTax ? "bg-blue-600" : "bg-white/[0.1]"}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${intlTax ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                      </button>
                      <span className={`text-sm font-dm font-medium transition-colors ${intlTax ? "text-blue-400" : "text-white/25"}`}>
                        {intlTax ? t.ossActive : t.ossInactive}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Actions ── */}
            <div className="flex items-center justify-between">
              <button onClick={handleReset} className="text-sm text-white/25 hover:text-white/55 transition-colors font-dm">{t.restart}</button>
              {step === "configure" && (
                <button onClick={() => setStep("parameters")} disabled={!canContinue}
                  className={`px-6 py-2.5 font-syne font-600 text-sm rounded-xl tracking-wide transition-all duration-200 ${canContinue ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5" : "bg-white/[0.04] text-white/18 cursor-not-allowed"}`}>
                  {t.continue}
                </button>
              )}
              {step === "parameters" && (
                <button onClick={() => setStep("done")} disabled={!canFinish}
                  className={`px-6 py-2.5 font-syne font-600 text-sm rounded-xl tracking-wide transition-all duration-200 ${canFinish ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5" : "bg-white/[0.04] text-white/18 cursor-not-allowed"}`}>
                  {t.finishIntegration}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══ DONE ══ */}
        {step === "done" && (
          <div className="flex flex-col items-center gap-6 text-center max-w-sm fade-up">
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="font-syne font-700 text-2xl text-white mb-2 tracking-tight">{t.doneTitle}</h2>
              <p className="text-white/40 text-sm font-dm leading-relaxed">{t.doneSubtitle}</p>
            </div>
            <div className="w-full rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 text-left space-y-3">
              {[
                { label: t.documentTypeLabel, value: invoiceTypeLabel(invoiceType) },
                { label: t.taxRateLabel,      value: `${taxRate}%` },
                { label: t.ossLabel,          value: ossEnabled ? t.ossActive : t.ossInactive, colored: ossEnabled },
                { label: t.autoFinalizeLabel, value: autoFinalize === "yes" ? t.yes : t.no },
                { label: "Software",          value: selectedSoftware?.name ?? "" },
              ].map(({ label, value, colored }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-white/35 text-xs font-dm">{label}</span>
                  <span className={`text-sm font-dm font-medium ${colored ? "text-emerald-400" : "text-white/80"}`}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleReset} className="text-xs text-white/30 hover:text-white/60 transition-colors font-dm">{t.newIntegration}</button>
          </div>
        )}
      </main>
    </div>
  );
}
