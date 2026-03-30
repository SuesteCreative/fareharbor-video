import type { Lang } from "./translations";

// ─── EU Countries ─────────────────────────────────────────────────────────────

export interface EuCountry {
  code: string;
  name: Record<Lang, string>;
  vatRate: number;
}

export const EU_COUNTRIES: EuCountry[] = [
  { code: "AT", name: { pt: "Áustria",       en: "Austria",         es: "Austria"       }, vatRate: 20   },
  { code: "BE", name: { pt: "Bélgica",       en: "Belgium",         es: "Bélgica"       }, vatRate: 21   },
  { code: "BG", name: { pt: "Bulgária",      en: "Bulgaria",        es: "Bulgaria"      }, vatRate: 20   },
  { code: "CY", name: { pt: "Chipre",        en: "Cyprus",          es: "Chipre"        }, vatRate: 19   },
  { code: "CZ", name: { pt: "Rep. Checa",    en: "Czech Republic",  es: "Rep. Checa"    }, vatRate: 21   },
  { code: "DE", name: { pt: "Alemanha",      en: "Germany",         es: "Alemania"      }, vatRate: 19   },
  { code: "DK", name: { pt: "Dinamarca",     en: "Denmark",         es: "Dinamarca"     }, vatRate: 25   },
  { code: "EE", name: { pt: "Estónia",       en: "Estonia",         es: "Estonia"       }, vatRate: 22   },
  { code: "EL", name: { pt: "Grécia",        en: "Greece",          es: "Grecia"        }, vatRate: 24   },
  { code: "ES", name: { pt: "Espanha",       en: "Spain",           es: "España"        }, vatRate: 21   },
  { code: "FI", name: { pt: "Finlândia",     en: "Finland",         es: "Finlandia"     }, vatRate: 25.5 },
  { code: "FR", name: { pt: "França",        en: "France",          es: "Francia"       }, vatRate: 20   },
  { code: "HR", name: { pt: "Croácia",       en: "Croatia",         es: "Croacia"       }, vatRate: 25   },
  { code: "HU", name: { pt: "Hungria",       en: "Hungary",         es: "Hungría"       }, vatRate: 27   },
  { code: "IE", name: { pt: "Irlanda",       en: "Ireland",         es: "Irlanda"       }, vatRate: 23   },
  { code: "IT", name: { pt: "Itália",        en: "Italy",           es: "Italia"        }, vatRate: 22   },
  { code: "LT", name: { pt: "Lituânia",      en: "Lithuania",       es: "Lituania"      }, vatRate: 21   },
  { code: "LU", name: { pt: "Luxemburgo",    en: "Luxembourg",      es: "Luxemburgo"    }, vatRate: 17   },
  { code: "LV", name: { pt: "Letónia",       en: "Latvia",          es: "Letonia"       }, vatRate: 21   },
  { code: "MT", name: { pt: "Malta",         en: "Malta",           es: "Malta"         }, vatRate: 18   },
  { code: "NL", name: { pt: "Países Baixos", en: "Netherlands",     es: "Países Bajos"  }, vatRate: 21   },
  { code: "PL", name: { pt: "Polónia",       en: "Poland",          es: "Polonia"       }, vatRate: 23   },
  { code: "PT", name: { pt: "Portugal",      en: "Portugal",        es: "Portugal"      }, vatRate: 23   },
  { code: "RO", name: { pt: "Roménia",       en: "Romania",         es: "Rumanía"       }, vatRate: 19   },
  { code: "SE", name: { pt: "Suécia",        en: "Sweden",          es: "Suecia"        }, vatRate: 25   },
  { code: "SI", name: { pt: "Eslovénia",     en: "Slovenia",        es: "Eslovenia"     }, vatRate: 22   },
  { code: "SK", name: { pt: "Eslováquia",    en: "Slovakia",        es: "Eslovaquia"    }, vatRate: 20   },
];

// ─── Exemption reasons ─────────────────────────────────────────────────────────

export interface ExemptionReason {
  code: string;
  label: string;
}

export const PT_EXEMPTIONS: ExemptionReason[] = [
  { code: "M01", label: "M01 — Art. 16.º n.º 6 al. a) a d) do CIVA — Não sujeição" },
  { code: "M02", label: "M02 — Art. 6.º D.L. n.º 198/90 — Vendas a exportador nacional" },
  { code: "M04", label: "M04 — Art. 13.º do CIVA — Isenções nas importações" },
  { code: "M05", label: "M05 — Art. 14.º do CIVA — Isenções nas exportações" },
  { code: "M06", label: "M06 — Art. 15.º do CIVA — Isenções em regimes suspensivos" },
  { code: "M07", label: "M07 — Art. 9.º do CIVA — Isenções em operações internas" },
  { code: "M09", label: "M09 — Art. 62.º al. b) do CIVA — Sem direito a dedução" },
  { code: "M10", label: "M10 — Arts. 53.º a 57.º do CIVA — Regime de isenção (pequenos operadores)" },
  { code: "M11", label: "M11 — D.L. n.º 346/85 — Regime especial do tabaco" },
  { code: "M12", label: "M12 — D.L. n.º 221/85 — Margem de lucro: agências de viagem" },
  { code: "M13", label: "M13 — D.L. n.º 199/96 — Margem de lucro: bens em segunda mão" },
  { code: "M14", label: "M14 — D.L. n.º 199/96 — Margem de lucro: objetos de arte" },
  { code: "M15", label: "M15 — D.L. n.º 199/96 — Margem de lucro: objetos de coleção" },
  { code: "M16", label: "M16 — Art. 14.º do RITI — Transmissões intracomunitárias isentas" },
  { code: "M19", label: "M19 — Outras isenções específicas" },
  { code: "M20", label: "M20 — Art. 59.º-D n.º 2 do CIVA — Regime forfetário agrícola" },
  { code: "M21", label: "M21 — Art. 72.º n.º 4 do CIVA — Entregas por revendedores" },
  { code: "M25", label: "M25 — Art. 38.º n.º 1 al. a) do CIVA — Mercadorias à consignação" },
  { code: "M26", label: "M26 — Lei n.º 17/2023 — Isenção transitória em produtos alimentares" },
  { code: "M30", label: "M30 — Art. 2.º n.º 1 al. i) do CIVA — Autoliquidação: serviços de não residentes" },
  { code: "M31", label: "M31 — Art. 2.º n.º 1 al. j) do CIVA — Autoliquidação: empreitadas de construção civil" },
  { code: "M32", label: "M32 — Art. 2.º n.º 1 al. l) do CIVA — Autoliquidação: direitos de emissão de gases" },
  { code: "M33", label: "M33 — Art. 2.º n.º 1 al. m) do CIVA — Autoliquidação: cortiça, madeira, pinhas" },
  { code: "M40", label: "M40 — Art. 6.º n.º 6 al. a) do CIVA — Autoliquidação: operações não localizadas em PT" },
  { code: "M41", label: "M41 — Art. 8.º n.º 3 do RITI — Aquisição intracomunitária tributada noutro EM" },
  { code: "M42", label: "M42 — D.L. n.º 21/2007 — Autoliquidação (regime específico)" },
  { code: "M43", label: "M43 — D.L. n.º 362/99 — Autoliquidação (regime específico)" },
  { code: "M44", label: "M44 — Art. 6.º do CIVA — Operações localizadas noutro EM por regras de exceção" },
  { code: "M45", label: "M45 — Art. 58.º-A do CIVA — Regime Transfronteiriço de Isenção" },
  { code: "M46", label: "M46 — D.L. n.º 19/2017 — Esquema e-TaxFree (viajantes)" },
  { code: "M99", label: "M99 — Não sujeito; não tributado (outros casos)" },
];

export const ES_EXEMPTIONS: ExemptionReason[] = [
  { code: "Art.20.1.1º",  label: "Art. 20.1.1º — Servicios postales universales" },
  { code: "Art.20.1.2º",  label: "Art. 20.1.2º — Hospitalización y asistencia sanitaria" },
  { code: "Art.20.1.3º",  label: "Art. 20.1.3º — Asistencia a personas físicas por profesionales médicos" },
  { code: "Art.20.1.4º",  label: "Art. 20.1.4º — Sangre, plasma y tejidos humanos para fines médicos" },
  { code: "Art.20.1.5º",  label: "Art. 20.1.5º — Servicios de odontólogos y protésicos dentales" },
  { code: "Art.20.1.6º",  label: "Art. 20.1.6º — Servicios de uniones y agrupaciones a sus miembros" },
  { code: "Art.20.1.8º",  label: "Art. 20.1.8º — Asistencia social (infancia, tercera edad, drogodependientes)" },
  { code: "Art.20.1.9º",  label: "Art. 20.1.9º — Educación y formación profesional por entidades autorizadas" },
  { code: "Art.20.1.10º", label: "Art. 20.1.10º — Clases particulares sobre materias del sistema educativo" },
  { code: "Art.20.1.13º", label: "Art. 20.1.13º — Servicios deportivos por entidades sin ánimo de lucro" },
  { code: "Art.20.1.14º", label: "Art. 20.1.14º — Servicios culturales por entidades públicas o sociales" },
  { code: "Art.20.1.15º", label: "Art. 20.1.15º — Transporte de enfermos en ambulancias" },
  { code: "Art.20.1.16º", label: "Art. 20.1.16º — Operaciones de seguro y reaseguro" },
  { code: "Art.20.1.18º", label: "Art. 20.1.18º — Operaciones financieras (depósitos, créditos, valores)" },
  { code: "Art.20.1.19º", label: "Art. 20.1.19º — Loterías, apuestas y juegos autorizados" },
  { code: "Art.20.1.20º", label: "Art. 20.1.20º — Entregas de terrenos rústicos no edificables" },
  { code: "Art.20.1.22º", label: "Art. 20.1.22º — Segundas y ulteriores entregas de edificaciones" },
  { code: "Art.20.1.23º", label: "Art. 20.1.23º — Arrendamiento de terrenos y viviendas" },
  { code: "Art.20.1.24º", label: "Art. 20.1.24º — Bienes usados en operaciones exentas sin derecho a deducir" },
  { code: "Art.20.1.26º", label: "Art. 20.1.26º — Cesión de derechos de autor por artistas y escritores" },
  { code: "Art.21",       label: "Art. 21 — Exenciones en exportaciones de bienes" },
  { code: "Art.22",       label: "Art. 22 — Exenciones en operaciones asimiladas a exportaciones" },
  { code: "Art.25",       label: "Art. 25 — Entregas intracomunitarias de bienes exentas" },
  { code: "Art.26",       label: "Art. 26 — Adquisiciones intracomunitarias exentas" },
  { code: "NoSujeto",     label: "No Sujeto — Art. 7 — Operaciones no sujetas al IVA" },
];

export const GENERIC_EXEMPTIONS: ExemptionReason[] = [
  { code: "EU-138", label: "Art. 138 EU VAT Directive — Intra-EU supply of goods (zero-rated)" },
  { code: "EU-146", label: "Art. 146 EU VAT Directive — Export of goods outside the EU" },
  { code: "EU-196", label: "Art. 196 EU VAT Directive — Reverse charge (B2B services)" },
  { code: "EU-148", label: "Art. 148 EU VAT Directive — Supply of services for sea-going vessels/aircraft" },
  { code: "EU-132a", label: "Art. 132(1)(a) — Hospital and medical care (public bodies)" },
  { code: "EU-132b", label: "Art. 132(1)(b) — Hospital and medical care (other entities)" },
  { code: "EU-132i", label: "Art. 132(1)(i) — Education and vocational training" },
  { code: "EU-132l", label: "Art. 132(1)(l) — Membership services (non-profit organisations)" },
  { code: "EU-135a", label: "Art. 135(1)(a) — Insurance transactions" },
  { code: "EU-135b", label: "Art. 135(1)(b) — Financial transactions (guarantees, credits)" },
  { code: "EU-135e", label: "Art. 135(1)(e) — Transactions in currency" },
  { code: "EU-135f", label: "Art. 135(1)(f) — Transactions in shares and securities" },
  { code: "EU-135l", label: "Art. 135(1)(l) — Leasing or letting of immovable property" },
  { code: "OTHER",   label: "Other exemption — consult local tax authority" },
];

export function getExemptions(country: string): ExemptionReason[] {
  if (country === "pt") return PT_EXEMPTIONS;
  if (country === "es") return ES_EXEMPTIONS;
  return GENERIC_EXEMPTIONS;
}
