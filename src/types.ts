export type Lang = "en" | "lg" | "sw";

export type Sector =
  | "communications"
  | "regional"
  | "economic"
  | "security"
  | "social"
  | "governance"
  | "infrastructure";

export type Urgency = "critical" | "important" | "standard";

export interface Ministry {
  id: string;
  cat: Sector;
  code: string;
  name: string;
  lead: string;
  mandate: string;
  web: string;
  email: string;
  phone: string;
  year: string;
  reports: string;
  hq?: string;
}

export interface Release {
  min: string;
  urg: Urgency;
  date: string;
  cat: string;
  title: string;
  p: string;
  href: string;
  img: string;
  ch: string[];
}

export interface MinistryEvent {
  min: string;
  date: string;
  title: string;
  where: string;
}

export interface UmcApi {
  t: (key: string) => string;
  applyI18n: () => void;
  getLang: () => Lang;
  setLang: (next: string | null, opts?: { toast?: boolean }) => void;
}

declare global {
  interface Window {
    UMC?: UmcApi;
  }
}

export {};
