"use client";

import { useState } from "react";
import { translations, type Lang } from "./translations";

// ─── Types ─────────────────────────────────────────────────────────────────

type ValidationState = "idle" | "validating" | "valid" | "invalid";
type Country = "pt" | "es";
type SoftwareId = "invoicexpress" | "moloni" | "billin" | "holded";

// ─── Billing software catalogue ─────────────────────────────────────────────

const BILLING_SOFTWARE: Record<Country, { id: SoftwareId; name: string; logo: string; ext: string }[]> = {
  pt: [
    { id: "invoicexpress", name: "InvoiceXpress", logo: "/invoicexpress-logo.svg", ext: "svg" },
    { id: "moloni",        name: "Moloni",         logo: "/moloni.logo.svg",        ext: "svg" },
  ],
  es: [
    { id: "billin", name: "Billin", logo: "/billin-logo.png", ext: "png" },
    { id: "holded", name: "Holded", logo: "/holded-logo.svg",  ext: "svg" },
  ],
};

// ─── Validation hook ─────────────────────────────────────────────────────────

function useFieldValidation() {
  const [state, setState] = useState<ValidationState>("idle");
  const validate = (value: string) => {
    if (!value) { setState("idle"); return; }
    setState("validating");
    setTimeout(() => setState(value.length >= 6 ? "valid" : "invalid"), 850);
  };
  const reset = () => setState("idle");
  return { state, validate, reset };
}

// ─── Validation icon ─────────────────────────────────────────────────────────

function ValidationIcon({ state }: { state: ValidationState }) {
  if (state === "validating")
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </span>
    );
  if (state === "valid")
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    );
  if (state === "invalid")
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  return null;
}

// ─── Input class ─────────────────────────────────────────────────────────────

function inputCls(state: ValidationState, disabled?: boolean) {
  const base = `w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200 pr-10 font-dm ${
    disabled ? "opacity-40 cursor-not-allowed bg-white/[0.02] border border-white/[0.06]" : "bg-white/[0.04] border"
  }`;
  if (state === "valid")   return `${base} border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/30`;
  if (state === "invalid") return `${base} border-red-500/50 focus:border-red-400 focus:ring-1 focus:ring-red-500/20`;
  return `${base} border-white/[0.09] focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20`;
}

// ─── Select class ─────────────────────────────────────────────────────────────

const selectCls = "w-full appearance-none bg-white/[0.04] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 cursor-pointer pr-8 font-dm";

// ─── Chevron icon ─────────────────────────────────────────────────────────────

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 text-white/30 pointer-events-none ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ─── Invoice doc SVG (for billing panel) ─────────────────────────────────────

function InvoiceDocIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" fill="currentColor"/>
      <path d="M12 11V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M12 13v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M10.5 9.5h2a.5.5 0 0 1 0 1h-1a1.5 1.5 0 0 0 0 3h1a.5.5 0 0 1 0 1h-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

// ─── Language selector ────────────────────────────────────────────────────────

const FLAG: Record<Lang, string> = { pt: "🇵🇹", en: "🇬🇧", es: "🇪🇸" };
const LABEL: Record<Lang, string> = { pt: "PT", en: "EN", es: "ES" };

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative z-50">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.06] transition-all text-sm text-white/60 hover:text-white font-dm"
      >
        <span className="text-base leading-none">{FLAG[lang]}</span>
        <span className="font-medium tracking-wide">{LABEL[lang]}</span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-28 bg-[#111520] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
          {(["pt", "en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => { onChange(l); setOpen(false); }}
              className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm font-dm transition-colors ${
                lang === l
                  ? "bg-blue-600/15 text-white"
                  : "text-white/50 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span>{FLAG[l]}</span>
              <span className="font-medium">{LABEL[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function Steps({ current, t }: { current: "configure" | "parameters" | "done"; t: { credentials: string; parameters: string; done: string } }) {
  const steps = [
    { id: "configure", label: t.credentials },
    { id: "parameters", label: t.parameters },
    { id: "done", label: t.done },
  ];
  const idx = steps.findIndex(s => s.id === current);
  return (
    <div className="flex items-center gap-1.5">
      {steps.map((s, i) => {
        const done = i < idx;
        const active = s.id === current;
        return (
          <div key={s.id} className="flex items-center gap-1.5">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${done ? "bg-emerald-500" : active ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]" : "bg-white/15"}`} />
              <span className={`text-[9px] font-dm font-medium tracking-wide uppercase ${active ? "text-white/60" : done ? "text-emerald-500/60" : "text-white/18"}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && <div className="w-6 h-px bg-white/[0.08] mb-3" />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Verified badge ───────────────────────────────────────────────────────────

function VerifiedBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-dm font-medium">
      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      {label}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label, type = "text", value, onChange, placeholder, validation, disabled, hint
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder: string;
  validation: ReturnType<typeof useFieldValidation>;
  disabled?: boolean; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => { onChange(e.target.value); validation.validate(e.target.value); }}
          placeholder={placeholder}
          className={inputCls(validation.state, disabled)}
          disabled={disabled}
        />
        <ValidationIcon state={validation.state} />
      </div>
      {hint && validation.state === "valid" && (
        <p className="text-[11px] text-emerald-400/80 mt-1 font-dm">{hint}</p>
      )}
      {validation.state === "invalid" && (
        <p className="text-[11px] text-red-400/80 mt-1 font-dm">Invalid — must be at least 6 characters</p>
      )}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [lang, setLang] = useState<Lang>("pt");
  const t = translations[lang];
  const [step, setStep] = useState<"initial" | "configure" | "parameters" | "done">("initial");

  // FareHarbor
  const [fhShortName, setFhShortName] = useState("");
  const [fhApiKey, setFhApiKey]       = useState("");
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
  const [invoiceType,  setInvoiceType]  = useState("");
  const [taxRate,      setTaxRate]      = useState("");
  const [ossEnabled,   setOssEnabled]   = useState(false);
  const [autoFinalize, setAutoFinalize] = useState("");

  const selectCountry = (c: Country) => {
    setBillCountry(c);
    setBillSoftware("");
    setBillCompany(""); billCompanyV.reset();
    setBillApiKey("");  billApiKeyV.reset();
  };

  const selectSoftware = (id: SoftwareId) => {
    setBillSoftware(id);
    setBillCompany(""); billCompanyV.reset();
    setBillApiKey("");  billApiKeyV.reset();
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
    setInvoiceType(""); setTaxRate(""); setOssEnabled(false); setAutoFinalize("");
  };

  const currentSoftwareOptions = billCountry ? BILLING_SOFTWARE[billCountry] : [];
  const selectedSoftware = currentSoftwareOptions.find(s => s.id === billSoftware);
  const invoiceTypeLabel = (v: string) =>
    v === "fatura-recibo" ? t.faturaRecibo : v === "simplified" ? t.simplifiedInvoice : t.fatura;

  return (
    <div className="min-h-screen dot-bg vignette relative font-dm bg-[#07090e]">
      {/* ── Ambient glow ── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/[0.04] blur-[80px] rounded-full pointer-events-none z-0" />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-syne font-600 text-white/80 text-[15px] tracking-tight">Integration Hub</span>
        </div>

        <div className="flex items-center gap-5">
          {step !== "initial" && (
            <Steps current={step === "done" ? "done" : step} t={t.steps} />
          )}
          <LangSelector lang={lang} onChange={setLang} />
        </div>
      </header>

      {/* ── Content ── */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-61px)] px-6 py-12">

        {/* ══ INITIAL ══ */}
        {step === "initial" && (
          <div className="flex flex-col items-center gap-10 fade-up max-w-xl w-full text-center">
            {/* Logo bridge */}
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/fareharbor-logo.svg"
                  alt="FareHarbor"
                  className="h-14 w-14 object-contain"
                  style={{ filter: "brightness(0) invert(1) opacity(0.9)" }}
                />
                <span className="text-[11px] text-white/35 font-dm uppercase tracking-widest">FareHarbor</span>
              </div>

              <div className="flex flex-col items-center gap-1 px-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-10 h-px bg-gradient-to-r from-transparent to-white/20" />
                  <div className="w-6 h-6 rounded-full border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="w-10 h-px bg-gradient-to-l from-transparent to-white/20" />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-kapta-white.png"
                  alt="Kapta"
                  className="h-14 object-contain"
                />
                <span className="text-[11px] text-white/35 font-dm uppercase tracking-widest">{t.invoicingSoftware}</span>
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
                {/* Panel header with large FH logo */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0069b5]/10 border border-[#0069b5]/20 flex items-center justify-center p-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/fareharbor-logo.svg"
                        alt="FareHarbor"
                        className="w-full h-full object-contain"
                        style={{ filter: "invert(35%) sepia(90%) saturate(600%) hue-rotate(190deg) brightness(110%)" }}
                      />
                    </div>
                    <div>
                      <h2 className="font-syne font-600 text-white text-[15px]">{t.fareharbor}</h2>
                      <p className="text-white/35 text-xs font-dm mt-0.5">{t.fareharborSubtitle}</p>
                    </div>
                  </div>
                  {fhValid && <VerifiedBadge label={t.verified} />}
                </div>

                <div className="space-y-4">
                  <Field
                    label={t.shortName}
                    value={fhShortName}
                    onChange={setFhShortName}
                    placeholder={t.shortNamePlaceholder}
                    validation={fhShortNameV}
                    disabled={step === "parameters"}
                    hint={t.shortNameValid}
                  />
                  <Field
                    label={t.apiKey}
                    type="password"
                    value={fhApiKey}
                    onChange={setFhApiKey}
                    placeholder={t.apiKeyPlaceholder}
                    validation={fhApiKeyV}
                    disabled={step === "parameters"}
                    hint={t.apiKeyValid}
                  />
                </div>
              </div>

              {/* ── Invoicing Software panel ── */}
              <div className={`rounded-2xl p-6 border transition-all duration-500 bg-white/[0.025] ${billValid ? "card-valid" : "border-white/[0.07]"}`}>
                {/* Panel header */}
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

                {/* Country selector */}
                <div className="mb-4">
                  <label className="block text-[11px] font-dm font-medium text-white/40 mb-2 uppercase tracking-wider">{t.selectCountry}</label>
                  <div className="flex gap-2">
                    {(["pt", "es"] as Country[]).map((c) => (
                      <button
                        key={c}
                        onClick={() => !step.startsWith("parameters") && selectCountry(c)}
                        disabled={step === "parameters"}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-dm font-medium transition-all duration-200 ${
                          billCountry === c
                            ? "border-blue-500/50 bg-blue-500/10 text-white"
                            : "border-white/[0.08] bg-white/[0.02] text-white/50 hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
                        } ${step === "parameters" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <span className="text-base">{c === "pt" ? "🇵🇹" : "🇪🇸"}</span>
                        <span>{c === "pt" ? t.portugal : t.spain}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Software cards */}
                {billCountry && (
                  <div className="mb-4 fade-up">
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-2 uppercase tracking-wider">{t.selectSoftware}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {currentSoftwareOptions.map((sw) => (
                        <button
                          key={sw.id}
                          onClick={() => step !== "parameters" && selectSoftware(sw.id)}
                          disabled={step === "parameters"}
                          className={`sw-card flex items-center justify-center px-3 py-3 rounded-xl border ${
                            billSoftware === sw.id ? "selected" : "border-white/[0.07] bg-white/[0.02]"
                          } ${step === "parameters" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={sw.logo}
                            alt={sw.name}
                            className="h-7 w-auto object-contain max-w-[100px]"
                            style={sw.ext === "svg" ? { filter: "brightness(0) invert(1) opacity(0.85)" } : { filter: "brightness(1.1)" }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fields after software selected */}
                {selectedSoftware && (
                  <div className="space-y-3 fade-up">
                    <Field
                      label={t.companyName}
                      value={billCompany}
                      onChange={setBillCompany}
                      placeholder={t.companyNamePlaceholder}
                      validation={billCompanyV}
                      disabled={step === "parameters"}
                      hint={t.companyNameValid}
                    />
                    <Field
                      label={t.apiKey}
                      type="password"
                      value={billApiKey}
                      onChange={setBillApiKey}
                      placeholder={t.apiKeyPlaceholder}
                      validation={billApiKeyV}
                      disabled={step === "parameters"}
                      hint={t.apiKeyValid}
                    />
                  </div>
                )}

                {/* Placeholder when nothing selected */}
                {!billCountry && (
                  <div className="flex items-center justify-center h-24 rounded-xl border border-dashed border-white/[0.07] mt-2">
                    <p className="text-white/20 text-xs font-dm">{t.selectCountryFirst}</p>
                  </div>
                )}
                {billCountry && !billSoftware && (
                  <div className="flex items-center justify-center h-16 rounded-xl border border-dashed border-white/[0.07] mt-2">
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
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-syne font-600 text-white text-[15px]">{t.invoiceParams}</h2>
                    <p className="text-white/35 text-xs font-dm mt-0.5">{t.invoiceParamsSubtitle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

                  {/* Tax rate */}
                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.defaultTaxRate}</label>
                    <div className="relative">
                      <input
                        type="number" value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        placeholder="23" min="0" max="100"
                        className="w-full bg-white/[0.04] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none font-dm transition-all duration-200 focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/25 font-dm pointer-events-none">%</span>
                    </div>
                  </div>

                  {/* OSS toggle */}
                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.oss}</label>
                    <div className="flex items-center gap-2.5 h-[42px]">
                      <button
                        onClick={() => setOssEnabled(!ossEnabled)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${ossEnabled ? "bg-blue-600" : "bg-white/[0.1]"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${ossEnabled ? "translate-x-[18px]" : "translate-x-0.5"}`} />
                      </button>
                      <span className={`text-sm font-dm font-medium transition-colors ${ossEnabled ? "text-blue-400" : "text-white/25"}`}>
                        {ossEnabled ? t.ossActive : t.ossInactive}
                      </span>
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
              </div>
            )}

            {/* ── Actions ── */}
            <div className="flex items-center justify-between">
              <button onClick={handleReset} className="text-sm text-white/25 hover:text-white/55 transition-colors font-dm">
                {t.restart}
              </button>

              {step === "configure" && (
                <button
                  onClick={() => setStep("parameters")}
                  disabled={!canContinue}
                  className={`px-6 py-2.5 font-syne font-600 text-sm rounded-xl tracking-wide transition-all duration-200 ${
                    canContinue
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                      : "bg-white/[0.04] text-white/18 cursor-not-allowed"
                  }`}
                >
                  {t.continue}
                </button>
              )}

              {step === "parameters" && (
                <button
                  onClick={() => setStep("done")}
                  disabled={!canFinish}
                  className={`px-6 py-2.5 font-syne font-600 text-sm rounded-xl tracking-wide transition-all duration-200 ${
                    canFinish
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5"
                      : "bg-white/[0.04] text-white/18 cursor-not-allowed"
                  }`}
                >
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
                { label: t.taxRateLabel, value: `${taxRate}%` },
                { label: t.ossLabel, value: ossEnabled ? t.ossActive : t.ossInactive, colored: ossEnabled },
                { label: t.autoFinalizeLabel, value: autoFinalize === "yes" ? t.yes : t.no },
                { label: "Software", value: selectedSoftware?.name ?? "" },
              ].map(({ label, value, colored }) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-white/35 text-xs font-dm">{label}</span>
                  <span className={`text-sm font-dm font-medium ${colored ? "text-emerald-400" : "text-white/80"}`}>{value}</span>
                </div>
              ))}
            </div>

            <button onClick={handleReset} className="text-xs text-white/30 hover:text-white/60 transition-colors font-dm">
              {t.newIntegration}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
