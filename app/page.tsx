"use client";

import { useState } from "react";
import Image from "next/image";
import { translations, type Lang } from "./translations";

// ─── Validation ────────────────────────────────────────────────────────────────

type ValidationState = "idle" | "validating" | "valid" | "invalid";

function useFieldValidation() {
  const [state, setState] = useState<ValidationState>("idle");
  const validate = (value: string) => {
    if (!value) { setState("idle"); return; }
    setState("validating");
    setTimeout(() => setState(value.length >= 6 ? "valid" : "invalid"), 800);
  };
  return { state, validate };
}

function ValidationIcon({ state }: { state: ValidationState }) {
  if (state === "validating")
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        <svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </span>
    );
  if (state === "valid")
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        <svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    );
  if (state === "invalid")
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2">
        <svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </span>
    );
  return null;
}

function inputClass(state: ValidationState, disabled?: boolean) {
  const base = `w-full bg-white/5 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 pr-10 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`;
  if (state === "valid") return `${base} border-emerald-500 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/40`;
  if (state === "invalid") return `${base} border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-500/30`;
  return `${base} border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30`;
}

// ─── SVG for Kapta / Invoicing Software ─────────────────────────────────────

function InvoicingIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="2" width="24" height="32" rx="3" fill="none" stroke="#34d399" strokeWidth="1.8" />
      <line x1="11" y1="10" x2="25" y2="10" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="15" x2="25" y2="15" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="20" x2="20" y2="20" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="27" cy="27" r="6" fill="#059669" />
      <path d="M24.5 27l1.8 1.8 3.2-3.2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Language selector ───────────────────────────────────────────────────────

const FLAG: Record<Lang, string> = { pt: "🇵🇹", en: "🇬🇧", es: "🇪🇸" };
const LABEL: Record<Lang, string> = { pt: "PT", en: "EN", es: "ES" };

function LangSelector({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors text-sm text-white/70 hover:text-white"
      >
        <span>{FLAG[lang]}</span>
        <span className="font-medium">{LABEL[lang]}</span>
        <svg className={`w-3 h-3 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-24 bg-[#1a1f2e] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {(["pt", "en", "es"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => { onChange(l); setOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors ${lang === l ? "bg-blue-600/20 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
            >
              <span>{FLAG[l]}</span>
              <span>{LABEL[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step indicator ──────────────────────────────────────────────────────────

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`w-2 h-2 rounded-full transition-all ${done ? "bg-emerald-500" : active ? "bg-blue-500" : "bg-white/15"}`} />
      <span className={`text-[10px] ${active ? "text-white/70" : done ? "text-emerald-500/70" : "text-white/20"}`}>{label}</span>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [lang, setLang] = useState<Lang>("pt");
  const t = translations[lang];

  const [step, setStep] = useState<"initial" | "configure" | "parameters" | "done">("initial");

  // FareHarbor fields
  const [fhShortName, setFhShortName] = useState("");
  const [fhApiKey, setFhApiKey] = useState("");
  const fhShortNameV = useFieldValidation();
  const fhApiKeyV = useFieldValidation();

  // Billing software fields
  const [billApiKey, setBillApiKey] = useState("");
  const [billAccountName, setBillAccountName] = useState("");
  const billApiKeyV = useFieldValidation();
  const billAccountNameV = useFieldValidation();

  // Invoice parameters
  const [invoiceType, setInvoiceType] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [ossEnabled, setOssEnabled] = useState(false);
  const [autoFinalize, setAutoFinalize] = useState("");

  const canProceedToParams =
    fhShortNameV.state === "valid" &&
    fhApiKeyV.state === "valid" &&
    billApiKeyV.state === "valid" &&
    billAccountNameV.state === "valid";

  const canFinish = invoiceType !== "" && taxRate !== "" && autoFinalize !== "";

  const handleReset = () => {
    setStep("initial");
    setFhShortName(""); setFhApiKey("");
    setBillApiKey(""); setBillAccountName("");
    setInvoiceType(""); setTaxRate("");
    setOssEnabled(false); setAutoFinalize("");
  };

  const invoiceTypeLabel = (v: string) =>
    v === "fatura-recibo" ? t.faturaRecibo : v === "simplified" ? t.simplifiedInvoice : t.fatura;

  return (
    <main className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-6">
      {/* ── Header ── */}
      <div className="w-full max-w-5xl mb-10 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-white/90">Integration Hub</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {step !== "initial" && (
            <div className="flex items-center gap-2 text-xs text-white/40">
              <StepDot active={step === "configure"} done={step === "parameters" || step === "done"} label={t.steps.credentials} />
              <div className="w-8 h-px bg-white/10" />
              <StepDot active={step === "parameters"} done={step === "done"} label={t.steps.parameters} />
              <div className="w-8 h-px bg-white/10" />
              <StepDot active={step === "done"} done={false} label={t.steps.done} />
            </div>
          )}
          <LangSelector lang={lang} onChange={setLang} />
        </div>
      </div>

      {/* ── Initial screen ── */}
      {step === "initial" && (
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{t.pageTitle}</h1>
              <p className="text-white/50 text-sm max-w-md">{t.pageSubtitle}</p>
            </div>
          </div>

          {/* Logos row */}
          <div className="flex items-center gap-6 text-white/30 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 flex items-center">
                <Image src="/fareharbor-logo.png" alt="FareHarbor" width={120} height={32} className="object-contain h-8 w-auto" />
              </div>
            </div>
            <svg className="w-5 h-5 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <div className="flex items-center gap-2">
              <div className="h-8 flex items-center">
                <Image src="/logo-kapta-white.png" alt="Kapta" width={100} height={32} className="object-contain h-8 w-auto" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("configure")}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            {t.startButton}
          </button>
        </div>
      )}

      {/* ── Configure + Parameters ── */}
      {(step === "configure" || step === "parameters") && (
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* FareHarbor panel */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-[#1c7ed6]/10 border border-[#1c7ed6]/20 flex items-center justify-center overflow-hidden p-1.5">
                  <Image src="/fareharbor-logo.png" alt="FareHarbor" width={28} height={28} className="object-contain w-full h-full" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">{t.fareharbor}</h2>
                  <p className="text-white/40 text-xs">{t.fareharborSubtitle}</p>
                </div>
                {fhShortNameV.state === "valid" && fhApiKeyV.state === "valid" && (
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t.verified}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.shortName}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fhShortName}
                      onChange={(e) => { setFhShortName(e.target.value); fhShortNameV.validate(e.target.value); }}
                      placeholder={t.shortNamePlaceholder}
                      className={inputClass(fhShortNameV.state, step === "parameters")}
                      disabled={step === "parameters"}
                    />
                    <ValidationIcon state={fhShortNameV.state} />
                  </div>
                  {fhShortNameV.state === "valid" && <p className="text-xs text-emerald-400 mt-1">{t.shortNameValid}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.apiKey}</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={fhApiKey}
                      onChange={(e) => { setFhApiKey(e.target.value); fhApiKeyV.validate(e.target.value); }}
                      placeholder={t.apiKeyPlaceholder}
                      className={inputClass(fhApiKeyV.state, step === "parameters")}
                      disabled={step === "parameters"}
                    />
                    <ValidationIcon state={fhApiKeyV.state} />
                  </div>
                  {fhApiKeyV.state === "valid" && <p className="text-xs text-emerald-400 mt-1">{t.apiKeyValid}</p>}
                  {fhApiKeyV.state === "invalid" && <p className="text-xs text-red-400 mt-1">{t.apiKeyInvalid}</p>}
                </div>
              </div>
            </div>

            {/* Kapta / Invoicing software panel */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center overflow-hidden p-1.5">
                  <Image src="/logo-kapta-white.png" alt="Kapta" width={28} height={28} className="object-contain w-full h-full" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">{t.invoicingSoftware}</h2>
                  <p className="text-white/40 text-xs">{t.invoicingSoftwareSubtitle}</p>
                </div>
                {billApiKeyV.state === "valid" && billAccountNameV.state === "valid" && (
                  <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t.verified}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.apiKey}</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={billApiKey}
                      onChange={(e) => { setBillApiKey(e.target.value); billApiKeyV.validate(e.target.value); }}
                      placeholder={t.apiKeyPlaceholder}
                      className={inputClass(billApiKeyV.state, step === "parameters")}
                      disabled={step === "parameters"}
                    />
                    <ValidationIcon state={billApiKeyV.state} />
                  </div>
                  {billApiKeyV.state === "valid" && <p className="text-xs text-emerald-400 mt-1">{t.apiKeyValid}</p>}
                  {billApiKeyV.state === "invalid" && <p className="text-xs text-red-400 mt-1">{t.apiKeyInvalid}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.accountName}</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={billAccountName}
                      onChange={(e) => { setBillAccountName(e.target.value); billAccountNameV.validate(e.target.value); }}
                      placeholder={t.accountNamePlaceholder}
                      className={inputClass(billAccountNameV.state, step === "parameters")}
                      disabled={step === "parameters"}
                    />
                    <ValidationIcon state={billAccountNameV.state} />
                  </div>
                  {billAccountNameV.state === "valid" && <p className="text-xs text-emerald-400 mt-1">{t.accountNameValid}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice parameters */}
          {step === "parameters" && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center p-1.5">
                  <InvoicingIcon />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">{t.invoiceParams}</h2>
                  <p className="text-white/40 text-xs">{t.invoiceParamsSubtitle}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Document type */}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.documentType}</label>
                  <div className="relative">
                    <select
                      value={invoiceType}
                      onChange={(e) => setInvoiceType(e.target.value)}
                      className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 cursor-pointer pr-8"
                    >
                      <option value="" disabled className="bg-[#1a1f2e]">{t.selectPlaceholder}</option>
                      <option value="fatura" className="bg-[#1a1f2e]">{t.fatura}</option>
                      <option value="fatura-recibo" className="bg-[#1a1f2e]">{t.faturaRecibo}</option>
                      <option value="simplified" className="bg-[#1a1f2e]">{t.simplifiedInvoice}</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Tax rate */}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.defaultTaxRate}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={taxRate}
                      onChange={(e) => setTaxRate(e.target.value)}
                      placeholder="23"
                      min="0"
                      max="100"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30">%</span>
                  </div>
                </div>

                {/* OSS toggle */}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.oss}</label>
                  <div className="flex items-center gap-3 h-[42px]">
                    <button
                      onClick={() => setOssEnabled(!ossEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${ossEnabled ? "bg-blue-600" : "bg-white/10"}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${ossEnabled ? "translate-x-6" : "translate-x-1"}`} />
                    </button>
                    <span className={`text-sm font-medium transition-colors ${ossEnabled ? "text-blue-400" : "text-white/30"}`}>
                      {ossEnabled ? t.ossActive : t.ossInactive}
                    </span>
                  </div>
                </div>

                {/* Auto-finalize */}
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">{t.autoFinalize}</label>
                  <div className="relative">
                    <select
                      value={autoFinalize}
                      onChange={(e) => setAutoFinalize(e.target.value)}
                      className="w-full appearance-none bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all duration-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 cursor-pointer pr-8"
                    >
                      <option value="" disabled className="bg-[#1a1f2e]">{t.selectPlaceholder}</option>
                      <option value="yes" className="bg-[#1a1f2e]">{t.yes}</option>
                      <option value="no" className="bg-[#1a1f2e]">{t.no}</option>
                    </select>
                    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action row */}
          <div className="flex items-center justify-between">
            <button onClick={handleReset} className="text-sm text-white/30 hover:text-white/60 transition-colors">
              {t.restart}
            </button>

            {step === "configure" && (
              <button
                onClick={() => setStep("parameters")}
                disabled={!canProceedToParams}
                className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition-all duration-200 ${
                  canProceedToParams
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {t.continue}
              </button>
            )}

            {step === "parameters" && (
              <button
                onClick={() => setStep("done")}
                disabled={!canFinish}
                className={`px-6 py-2.5 font-semibold text-sm rounded-xl transition-all duration-200 ${
                  canFinish
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
              >
                {t.finishIntegration}
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Done screen ── */}
      {step === "done" && (
        <div className="flex flex-col items-center gap-6 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{t.doneTitle}</h2>
            <p className="text-white/50 text-sm">{t.doneSubtitle}</p>
          </div>
          <div className="w-full bg-white/[0.03] border border-white/8 rounded-xl p-4 text-left space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/40">{t.documentTypeLabel}</span>
              <span className="text-white">{invoiceTypeLabel(invoiceType)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">{t.taxRateLabel}</span>
              <span className="text-white">{taxRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">{t.ossLabel}</span>
              <span className={ossEnabled ? "text-emerald-400" : "text-white/40"}>{ossEnabled ? t.ossActive : t.ossInactive}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/40">{t.autoFinalizeLabel}</span>
              <span className="text-white">{autoFinalize === "yes" ? t.yes : t.no}</span>
            </div>
          </div>
          <button onClick={handleReset} className="text-sm text-white/40 hover:text-white/70 transition-colors">
            {t.newIntegration}
          </button>
        </div>
      )}
    </main>
  );
}
