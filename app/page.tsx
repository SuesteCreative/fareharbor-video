"use client";

import { useState } from "react";
import { translations, type Lang } from "./translations";
import { EU_COUNTRIES, getExemptions } from "./eu-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type ValidationState = "idle" | "validating" | "valid" | "invalid";
type Country = "pt" | "es";
type SoftwareId = "invoicexpress" | "moloni" | "billin" | "holded";
type Step = "initial" | "configure" | "parameters" | "dashboard";
type VatEntry = { code: string; vatRate: number };

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

const COUNTRY_OPTIONS = [
  { code: "pt" as const, flag: "🇵🇹", locked: false },
  { code: "es" as const, flag: "🇪🇸", locked: false },
  { code: "it",          flag: "🇮🇹", locked: true  },
  { code: "fr",          flag: "🇫🇷", locked: true  },
  { code: "de",          flag: "🇩🇪", locked: true  },
];

// ─── Validation ───────────────────────────────────────────────────────────────

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

function inputCls(state: ValidationState, disabled?: boolean) {
  const base = `w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all duration-200 pr-10 font-dm ${
    disabled ? "opacity-40 cursor-not-allowed bg-white/[0.02] border border-white/[0.06]" : "bg-white/[0.04] border"
  }`;
  if (state === "valid")   return `${base} border-emerald-500/60 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/30`;
  if (state === "invalid") return `${base} border-red-500/50`;
  return `${base} border-white/[0.09] focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20`;
}

const selectCls = "w-full appearance-none bg-white/[0.04] border border-white/[0.09] rounded-lg px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/20 cursor-pointer pr-8 font-dm";

// ─── Small atoms ─────────────────────────────────────────────────────────────

function ChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-3.5 h-3.5 text-white/30 pointer-events-none ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function ValidationIcon({ state }: { state: ValidationState }) {
  if (state === "validating") return <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="animate-spin h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg></span>;
  if (state === "valid")      return <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="h-4 w-4 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg></span>;
  if (state === "invalid")    return <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><svg className="h-4 w-4 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/></svg></span>;
  return null;
}

function VerifiedBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-dm font-medium shrink-0">
      <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
      {label}
    </div>
  );
}

function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <div className="relative group inline-flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-72 p-3 bg-[#0e1220] border border-white/[0.1] rounded-xl text-[11px] text-white/65 font-dm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-2xl">
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

// ─── Country dropdown (billing) ───────────────────────────────────────────────

function CountryDropdown({ value, onChange, disabled, t }: {
  value: Country | ""; onChange: (c: Country) => void; disabled?: boolean;
  t: { selectPlaceholder: string; portugal: string; spain: string; italy: string; france: string; germany: string; comingSoon: string };
}) {
  const [open, setOpen] = useState(false);
  const LABELS: Record<string, string> = { pt: t.portugal, es: t.spain, it: t.italy, fr: t.france, de: t.germany };
  const selected = COUNTRY_OPTIONS.find(c => c.code === value);
  return (
    <div className="relative">
      <button type="button" onClick={() => !disabled && setOpen(!open)} disabled={disabled}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border text-sm font-dm transition-all ${
          disabled ? "opacity-40 cursor-not-allowed bg-white/[0.02] border-white/[0.06] text-white/40"
          : open ? "bg-white/[0.06] border-blue-500/70 text-white"
          : "bg-white/[0.04] border-white/[0.09] text-white/80 hover:border-white/20"}`}>
        <span className="flex items-center gap-2">
          {selected
            ? <><span className="text-base">{selected.flag}</span><span>{LABELS[selected.code]}</span></>
            : <span className="text-white/30">{t.selectPlaceholder}</span>}
        </span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0e1220] border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl z-50">
          {COUNTRY_OPTIONS.map(opt => (
            <button key={opt.code} type="button"
              onClick={() => { if (!opt.locked) { onChange(opt.code as Country); setOpen(false); } }}
              className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-dm transition-colors ${
                opt.locked ? "text-white/25 cursor-not-allowed"
                : value === opt.code ? "bg-blue-600/15 text-white"
                : "text-white/60 hover:bg-white/[0.04] hover:text-white"}`}>
              <span className="text-base">{opt.flag}</span>
              <span className="flex-1">{LABELS[opt.code]}</span>
              {opt.locked && <span className="text-[10px] text-white/20 italic">{t.comingSoon}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({ label, type = "text", value, onChange, placeholder, validation, disabled, hint, tooltip }: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder: string; validation: ReturnType<typeof useFieldValidation>;
  disabled?: boolean; hint?: string; tooltip?: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-[11px] font-dm font-medium text-white/40 uppercase tracking-wider">{label}</label>
        {tooltip && <Tooltip content={tooltip}><InfoIcon /></Tooltip>}
      </div>
      <div className="relative">
        <input type={type} value={value} onChange={(e) => { onChange(e.target.value); validation.validate(e.target.value); }}
          placeholder={placeholder} className={inputCls(validation.state, disabled)} disabled={disabled} />
        <ValidationIcon state={validation.state} />
      </div>
      {hint && validation.state === "valid" && <p className="text-[11px] text-emerald-400/80 mt-1 font-dm">{hint}</p>}
      {validation.state === "invalid" && <p className="text-[11px] text-red-400/80 mt-1 font-dm">Mínimo 6 caracteres</p>}
    </div>
  );
}

// ─── VAT Countries list ───────────────────────────────────────────────────────

function VatCountriesList({ entries, onAdd, onRemove, onChangeRate, lang, t }: {
  entries: VatEntry[];
  onAdd: (code: string, rate: number) => void;
  onRemove: (code: string) => void;
  onChangeRate: (code: string, rate: number) => void;
  lang: Lang;
  t: { addCountry: string; addCountryPlaceholder: string; noCountriesAdded: string; countryAlreadyAdded: string; removeCountry: string };
}) {
  const [selector, setSelector] = useState("");
  const [error, setError] = useState("");

  const flagMap: Record<string, string> = { PT:"🇵🇹",ES:"🇪🇸",IT:"🇮🇹",FR:"🇫🇷",DE:"🇩🇪",AT:"🇦🇹",BE:"🇧🇪",BG:"🇧🇬",CY:"🇨🇾",CZ:"🇨🇿",DK:"🇩🇰",EE:"🇪🇪",EL:"🇬🇷",FI:"🇫🇮",HR:"🇭🇷",HU:"🇭🇺",IE:"🇮🇪",LT:"🇱🇹",LU:"🇱🇺",LV:"🇱🇻",MT:"🇲🇹",NL:"🇳🇱",PL:"🇵🇱",RO:"🇷🇴",SE:"🇸🇪",SI:"🇸🇮",SK:"🇸🇰" };

  const handleAdd = () => {
    if (!selector) return;
    if (entries.find(e => e.code === selector)) { setError(t.countryAlreadyAdded); return; }
    const country = EU_COUNTRIES.find(c => c.code === selector);
    if (country) { onAdd(country.code, country.vatRate); setSelector(""); setError(""); }
  };

  return (
    <div>
      {/* Selector row */}
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <select value={selector} onChange={(e) => { setSelector(e.target.value); setError(""); }}
            className={`${selectCls} pr-8`}>
            <option value="">{t.addCountryPlaceholder}</option>
            {EU_COUNTRIES.filter(c => !entries.find(e => e.code === c.code)).map(c => (
              <option key={c.code} value={c.code} className="bg-[#111520]">
                {flagMap[c.code]} {c.name[lang]} — {c.vatRate}%
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></span>
        </div>
        <button type="button" onClick={handleAdd} disabled={!selector}
          className={`px-4 py-2.5 rounded-lg text-sm font-dm font-medium transition-all ${selector ? "bg-blue-600 hover:bg-blue-500 text-white" : "bg-white/[0.04] text-white/25 cursor-not-allowed"}`}>
          + {t.addCountry}
        </button>
      </div>

      {error && <p className="text-[11px] text-red-400/80 mb-2 font-dm">{error}</p>}

      {/* Entries list */}
      {entries.length === 0 ? (
        <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-white/[0.07]">
          <p className="text-white/20 text-xs font-dm">{t.noCountriesAdded}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => {
            const country = EU_COUNTRIES.find(c => c.code === entry.code);
            if (!country) return null;
            return (
              <div key={entry.code} className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.07] fade-up">
                <span className="text-lg shrink-0">{flagMap[entry.code]}</span>
                <span className="text-sm font-dm text-white/75 flex-1">{country.name[lang]}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number" value={entry.vatRate} min="0" max="100" step="0.5"
                    onChange={(e) => onChangeRate(entry.code, parseFloat(e.target.value) || 0)}
                    className="w-16 text-center bg-white/[0.05] border border-white/[0.1] rounded-lg px-2 py-1 text-sm text-white font-dm outline-none focus:border-blue-500/60"
                  />
                  <span className="text-xs text-white/30 font-dm">%</span>
                </div>
                <button type="button" onClick={() => onRemove(entry.code)}
                  className="ml-1 text-white/20 hover:text-red-400 transition-colors shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
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
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] transition-all text-sm text-white/60 hover:text-white font-dm">
        <span className="text-base leading-none">{FLAG[lang]}</span>
        <span className="font-medium tracking-wide">{LABEL[lang]}</span>
        <ChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-28 bg-[#0e1220] border border-white/[0.1] rounded-xl shadow-2xl overflow-hidden">
          {(["pt", "en", "es"] as Lang[]).map(l => (
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

// ─── Steps ────────────────────────────────────────────────────────────────────

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

// ─── Icons ────────────────────────────────────────────────────────────────────

function LargeInvoiceIcon() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <path d="M10 4h24l12 12v32a4 4 0 01-4 4H10a4 4 0 01-4-4V8a4 4 0 014-4z" stroke="rgba(255,255,255,0.2)" strokeWidth="1.6" fill="rgba(255,255,255,0.02)"/>
      <path d="M34 4v12a2 2 0 002 2h12" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5"/>
      <line x1="12" y1="27" x2="36" y2="27" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="12" y1="33" x2="36" y2="33" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="12" y1="39" x2="26" y2="39" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="42" cy="42" r="11" fill="#1e40af"/>
      <path d="M42 36.5v1.5M42 44.5V46M38.8 40a2.2 2.2 0 011.8-1.8h2.4c.9 0 1.7.7 1.7 1.6 0 .9-.8 1.6-1.7 1.6h-2c-.9 0-1.7.7-1.7 1.6 0 .9.8 1.6 1.7 1.6h2.4" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

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

// ─── Dashboard Integration Card ───────────────────────────────────────────────

function IntegrationCard({ fhShortName, software, invoiceType, vatEntries, ossEnabled, autoFinalize, intlTax, onEdit, t, lang }: {
  fhShortName: string;
  software: { name: string; logo: string } | undefined;
  invoiceType: string;
  vatEntries: VatEntry[];
  ossEnabled: boolean;
  autoFinalize: string;
  intlTax: boolean;
  onEdit: () => void;
  t: typeof translations["pt"];
  lang: Lang;
}) {
  const flagMap: Record<string, string> = { PT:"🇵🇹",ES:"🇪🇸",IT:"🇮🇹",FR:"🇫🇷",DE:"🇩🇪",AT:"🇦🇹",BE:"🇧🇪",BG:"🇧🇬",CY:"🇨🇾",CZ:"🇨🇿",DK:"🇩🇰",EE:"🇪🇪",EL:"🇬🇷",FI:"🇫🇮",HR:"🇭🇷",HU:"🇭🇺",IE:"🇮🇪",LT:"🇱🇹",LU:"🇱🇺",LV:"🇱🇻",MT:"🇲🇹",NL:"🇳🇱",PL:"🇵🇱",RO:"🇷🇴",SE:"🇸🇪",SI:"🇸🇮",SK:"🇸🇰" };
  const invoiceLabel = invoiceType === "fatura-recibo" ? t.faturaRecibo : invoiceType === "simplified" ? t.simplifiedInvoice : t.fatura;

  return (
    <div className="rounded-2xl border border-emerald-500/20 bg-white/[0.025] p-6 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.04] blur-3xl rounded-full pointer-events-none" />

      {/* Status badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-dm font-medium text-emerald-400">{t.activeStatus}</span>
        </div>
        <button onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.09] bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all text-xs font-dm text-white/60 hover:text-white">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
          {t.editIntegration}
        </button>
      </div>

      {/* Connected services */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#0069b5]/10 border border-[#0069b5]/20 flex items-center justify-center p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fareharbor-logo.svg" alt="FareHarbor" className="w-full h-full object-contain"
              style={{ filter: "invert(35%) sepia(90%) saturate(600%) hue-rotate(190deg) brightness(110%)" }} />
          </div>
          <div>
            <p className="text-xs font-dm font-medium text-white/70">FareHarbor</p>
            <p className="text-[11px] font-dm text-white/35">{fhShortName}</p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-1">
            <div className="w-6 h-px bg-emerald-500/30" />
            <svg className="w-4 h-4 text-emerald-500/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
            </svg>
            <div className="w-6 h-px bg-emerald-500/30" />
          </div>
        </div>

        {software && (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={software.logo} alt={software.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-xs font-dm font-medium text-white/70">{software.name}</p>
              <p className="text-[11px] font-dm text-white/35">{t.invoicingSoftware}</p>
            </div>
          </div>
        )}
      </div>

      {/* Settings row */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { label: t.documentType, value: invoiceLabel },
          { label: t.autoFinalizeLabel, value: autoFinalize === "yes" ? t.yes : t.no },
          { label: t.ossLabel, value: ossEnabled ? t.ossActive : t.ossInactive, colored: ossEnabled },
          { label: t.internationalTax, value: intlTax ? t.ossActive : t.ossInactive, colored: intlTax },
        ].map(({ label, value, colored }) => (
          <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <span className="text-[11px] text-white/35 font-dm">{label}:</span>
            <span className={`text-[11px] font-dm font-medium ${colored ? "text-blue-400" : "text-white/65"}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* VAT countries */}
      {vatEntries.length > 0 && (
        <div>
          <p className="text-[11px] font-dm font-medium text-white/35 uppercase tracking-wider mb-2">{t.vatCountriesLabel}</p>
          <div className="flex flex-wrap gap-1.5">
            {vatEntries.map(e => {
              const country = EU_COUNTRIES.find(c => c.code === e.code);
              return (
                <div key={e.code} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/8 border border-blue-500/15 text-[12px] font-dm text-white/70">
                  <span>{flagMap[e.code]}</span>
                  <span>{country?.name[lang]}</span>
                  <span className="text-blue-400 font-medium">{e.vatRate}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [lang, setLang] = useState<Lang>("pt");
  const [step, setStep] = useState<Step>("initial");
  const [isEditing, setIsEditing] = useState(false);
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
  const [invoiceType,  setInvoiceType]  = useState("");
  const [vatEntries,   setVatEntries]   = useState<VatEntry[]>([]);
  const [intlTax,      setIntlTax]      = useState(false);
  const [exemptReason, setExemptReason] = useState("");
  const [ossEnabled,   setOssEnabled]   = useState(false);
  const [autoFinalize, setAutoFinalize] = useState("");

  const selectCountry = (c: Country) => {
    setBillCountry(c); setBillSoftware("");
    setBillCompany(""); billCompanyV.reset();
    setBillApiKey("");  billApiKeyV.reset();
  };

  const fhValid   = fhShortNameV.state === "valid" && fhApiKeyV.state === "valid";
  const billValid = billCountry !== "" && billSoftware !== "" && billCompanyV.state === "valid" && billApiKeyV.state === "valid";
  const canContinue = fhValid && billValid;
  const canFinish   = invoiceType !== "" && vatEntries.length > 0 && autoFinalize !== "";

  const handleFinish = () => { setStep("dashboard"); setIsEditing(false); };
  const handleEdit   = () => { setIsEditing(true); setStep("configure"); };
  const handleBackToDash = () => { setStep("dashboard"); setIsEditing(false); };

  const handleReset = () => {
    setStep("initial"); setIsEditing(false);
    setFhShortName(""); setFhApiKey(""); fhShortNameV.reset(); fhApiKeyV.reset();
    setBillCountry(""); setBillSoftware(""); setBillCompany(""); setBillApiKey("");
    billCompanyV.reset(); billApiKeyV.reset();
    setInvoiceType(""); setVatEntries([]); setIntlTax(false);
    setExemptReason(""); setOssEnabled(false); setAutoFinalize("");
  };

  const softwareOptions  = billCountry ? BILLING_SOFTWARE[billCountry] : [];
  const selectedSoftware = softwareOptions.find(s => s.id === billSoftware);
  const exemptions       = getExemptions(billCountry);

  const inConfig = step === "configure" || step === "parameters";

  return (
    <div className="min-h-screen dot-bg vignette relative font-dm bg-[#07090e]">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-blue-600/[0.04] blur-[100px] rounded-full pointer-events-none z-0" />

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-8 py-4 border-b border-white/[0.06]">
        {/* Brand: Kapta above + Integration Hub below */}
        <div className="flex flex-col gap-0.5">
          <a href="https://kapta.pt/" target="_blank" rel="noopener noreferrer" className="group w-fit">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-kapta-white.png" alt="Kapta" className="h-4 w-auto object-contain opacity-55 group-hover:opacity-90 transition-all duration-200 group-hover:scale-105 origin-left" />
          </a>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-600/30">
              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <span className="font-syne font-600 text-white/75 text-[13px] tracking-tight">Integration Hub</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          {inConfig && <Steps current={step === "parameters" ? "parameters" : "configure"} t={t.steps} />}
          <LangSelector lang={lang} onChange={setLang} />
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-69px)] px-6 py-12">

        {/* ══ INITIAL ══ */}
        {step === "initial" && (
          <div className="flex flex-col items-center gap-10 fade-up max-w-xl w-full text-center">
            <div className="grid grid-cols-3 items-center w-full max-w-sm">
              <div className="flex flex-col items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/fareharbor-logo.svg" alt="FareHarbor" className="h-16 w-16 object-contain" style={{ filter: "brightness(0) invert(1) opacity(0.88)" }} />
                <span className="text-[10px] text-white/30 font-dm uppercase tracking-widest">FareHarbor</span>
              </div>
              <div className="flex justify-center">
                <div className="w-7 h-7 rounded-full border border-white/[0.1] bg-white/[0.03] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LargeInvoiceIcon />
                <span className="text-[10px] text-white/30 font-dm uppercase tracking-widest">{t.invoicingSoftware}</span>
              </div>
            </div>
            <div>
              <h1 className="font-syne font-700 text-4xl text-white mb-3 tracking-tight">{t.pageTitle}</h1>
              <p className="text-white/45 text-[15px] leading-relaxed font-dm max-w-sm mx-auto">{t.pageSubtitle}</p>
            </div>
            <button onClick={() => setStep("configure")} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-syne font-600 text-sm rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:-translate-y-0.5 tracking-wide">
              {t.startButton}
            </button>
          </div>
        )}

        {/* ══ CONFIGURE / PARAMETERS ══ */}
        {inConfig && (
          <div className="w-full max-w-5xl fade-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

              {/* FareHarbor panel */}
              <div className={`rounded-2xl p-6 border transition-all duration-500 bg-white/[0.025] ${fhValid ? "card-valid" : "border-white/[0.07]"}`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0069b5]/10 border border-[#0069b5]/20 flex items-center justify-center p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/fareharbor-logo.svg" alt="FareHarbor" className="w-full h-full object-contain" style={{ filter: "invert(35%) sepia(90%) saturate(600%) hue-rotate(190deg) brightness(110%)" }} />
                    </div>
                    <div>
                      <h2 className="font-syne font-600 text-white text-[15px]">{t.fareharbor}</h2>
                      <p className="text-white/35 text-xs font-dm mt-0.5">{t.fareharborSubtitle}</p>
                    </div>
                  </div>
                  {fhValid && <VerifiedBadge label={t.verified} />}
                </div>
                <div className="space-y-4">
                  <Field label={t.shortName} value={fhShortName} onChange={setFhShortName} placeholder={t.shortNamePlaceholder} validation={fhShortNameV} disabled={step === "parameters"} hint={t.shortNameValid} />
                  <Field label={t.apiKey} type="password" value={fhApiKey} onChange={setFhApiKey} placeholder={t.apiKeyPlaceholder} validation={fhApiKeyV} disabled={step === "parameters"} hint={t.apiKeyValid} />
                </div>
              </div>

              {/* Invoicing software panel */}
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

                <div className="mb-4">
                  <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.selectCountry}</label>
                  <CountryDropdown value={billCountry} onChange={selectCountry} disabled={step === "parameters"} t={t} />
                </div>

                {billCountry && (
                  <div className="mb-4 fade-up">
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-2 uppercase tracking-wider">{t.selectSoftware}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {softwareOptions.map(sw => (
                        <button key={sw.id} type="button" onClick={() => step !== "parameters" && setBillSoftware(sw.id)} disabled={step === "parameters"}
                          className={`sw-card flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border ${billSoftware === sw.id ? "selected" : "border-white/[0.07] bg-white/[0.02]"} ${step === "parameters" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sw.logo} alt={sw.name} className="h-7 w-auto object-contain max-w-[90px]" />
                          <span className="text-[11px] font-dm font-medium text-white/60">{sw.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSoftware && (
                  <div className="space-y-3 fade-up">
                    <Field label={t.companyName} value={billCompany} onChange={setBillCompany} placeholder={t.companyNamePlaceholder} validation={billCompanyV} disabled={step === "parameters"} hint={t.companyNameValid} />
                    <Field label={t.apiKey} type="password" value={billApiKey} onChange={setBillApiKey} placeholder={t.apiKeyPlaceholder} validation={billApiKeyV} disabled={step === "parameters"} hint={t.apiKeyValid} />
                  </div>
                )}

                {!billCountry && <div className="flex items-center justify-center h-20 rounded-xl border border-dashed border-white/[0.07] mt-2"><p className="text-white/20 text-xs font-dm">{t.selectCountryFirst}</p></div>}
                {billCountry && !billSoftware && <div className="flex items-center justify-center h-14 rounded-xl border border-dashed border-white/[0.07] mt-2"><p className="text-white/20 text-xs font-dm">{t.selectSoftwareFirst}</p></div>}
              </div>
            </div>

            {/* Parameters */}
            {step === "parameters" && (
              <div className="rounded-2xl p-6 border border-white/[0.07] bg-white/[0.025] mb-5 fade-up">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/15 flex items-center justify-center text-violet-400">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"/></svg>
                  </div>
                  <div>
                    <h2 className="font-syne font-600 text-white text-[15px]">{t.invoiceParams}</h2>
                    <p className="text-white/35 text-xs font-dm mt-0.5">{t.invoiceParamsSubtitle}</p>
                  </div>
                </div>

                {/* Row 1: doc type + auto-finalize */}
                <div className="grid grid-cols-2 gap-4 mb-4">
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

                {/* VAT countries list */}
                <div className="mb-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <label className="text-[11px] font-dm font-medium text-white/40 uppercase tracking-wider">{t.vatRates}</label>
                  </div>
                  <p className="text-[11px] text-white/25 font-dm mb-3">{t.vatRatesSubtitle}</p>
                  <VatCountriesList
                    entries={vatEntries}
                    onAdd={(code, rate) => setVatEntries(prev => [...prev, { code, vatRate: rate }])}
                    onRemove={(code) => setVatEntries(prev => prev.filter(e => e.code !== code))}
                    onChangeRate={(code, rate) => setVatEntries(prev => prev.map(e => e.code === code ? { ...e, vatRate: rate } : e))}
                    lang={lang} t={t}
                  />
                </div>

                {/* Row 3: exempt reason + OSS + intl tax */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-[11px] font-dm font-medium text-white/40 uppercase tracking-wider">{t.exemptReason}</label>
                      <Tooltip content={t.exemptReasonTooltip}><InfoIcon /></Tooltip>
                    </div>
                    <div className="relative">
                      <select value={exemptReason} onChange={(e) => setExemptReason(e.target.value)} className={selectCls}>
                        <option value="" className="bg-[#111520]">{t.exemptReasonPlaceholder}</option>
                        {exemptions.map(r => <option key={r.code} value={r.code} className="bg-[#111520]">{r.label}</option>)}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown /></span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-dm font-medium text-white/40 mb-1.5 uppercase tracking-wider">{t.oss}</label>
                    <div className="flex items-center gap-2.5 h-[42px]">
                      <button type="button" onClick={() => setOssEnabled(!ossEnabled)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${ossEnabled ? "bg-blue-600" : "bg-white/[0.1]"}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${ossEnabled ? "translate-x-[18px]" : "translate-x-0.5"}`}/>
                      </button>
                      <span className={`text-sm font-dm font-medium transition-colors ${ossEnabled ? "text-blue-400" : "text-white/25"}`}>{ossEnabled ? t.ossActive : t.ossInactive}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <label className="text-[11px] font-dm font-medium text-white/40 uppercase tracking-wider">{t.internationalTax}</label>
                      <Tooltip content={t.internationalTaxTooltip}><InfoIcon /></Tooltip>
                    </div>
                    <div className="flex items-center gap-2.5 h-[42px]">
                      <button type="button" onClick={() => setIntlTax(!intlTax)} className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${intlTax ? "bg-blue-600" : "bg-white/[0.1]"}`}>
                        <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform ${intlTax ? "translate-x-[18px]" : "translate-x-0.5"}`}/>
                      </button>
                      <span className={`text-sm font-dm font-medium transition-colors ${intlTax ? "text-blue-400" : "text-white/25"}`}>{intlTax ? t.ossActive : t.ossInactive}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button onClick={isEditing ? handleBackToDash : handleReset} className="text-sm text-white/25 hover:text-white/55 transition-colors font-dm">
                {isEditing ? t.backToDashboard : t.restart}
              </button>
              {step === "configure" && (
                <button onClick={() => setStep("parameters")} disabled={!canContinue}
                  className={`px-6 py-2.5 font-syne font-600 text-sm rounded-xl tracking-wide transition-all ${canContinue ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 hover:-translate-y-0.5" : "bg-white/[0.04] text-white/18 cursor-not-allowed"}`}>
                  {t.continue}
                </button>
              )}
              {step === "parameters" && (
                <button onClick={handleFinish} disabled={!canFinish}
                  className={`px-6 py-2.5 font-syne font-600 text-sm rounded-xl tracking-wide transition-all ${canFinish ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5" : "bg-white/[0.04] text-white/18 cursor-not-allowed"}`}>
                  {t.finishIntegration}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ══ DASHBOARD ══ */}
        {step === "dashboard" && (
          <div className="w-full max-w-5xl fade-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-syne font-700 text-2xl text-white tracking-tight">{t.myIntegrations}</h1>
                <p className="text-white/35 text-sm font-dm mt-1">{t.doneSubtitle}</p>
              </div>
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 hover:bg-white/[0.06] transition-all text-sm font-dm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                {t.addIntegration}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Active integration */}
              <div className="lg:col-span-2">
                <IntegrationCard
                  fhShortName={fhShortName}
                  software={selectedSoftware}
                  invoiceType={invoiceType}
                  vatEntries={vatEntries}
                  ossEnabled={ossEnabled}
                  autoFinalize={autoFinalize}
                  intlTax={intlTax}
                  onEdit={handleEdit}
                  t={t}
                  lang={lang}
                />
              </div>

              {/* Placeholder cards */}
              <div className="flex flex-col gap-5">
                {[1, 2].map(i => (
                  <div key={i} className="rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.01] p-6 flex flex-col items-center justify-center gap-3 min-h-[130px]">
                    <div className="w-10 h-10 rounded-xl border border-dashed border-white/[0.1] flex items-center justify-center text-white/20">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    </div>
                    <div className="text-center">
                      <p className="text-white/20 text-xs font-dm font-medium">{t.addIntegration}</p>
                      <p className="text-white/12 text-[11px] font-dm mt-0.5">{t.comingSoonLabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
