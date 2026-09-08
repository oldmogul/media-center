type Lang = "en" | "lg" | "sw";

type Sector =
  | "communications"
  | "regional"
  | "economic"
  | "security"
  | "social"
  | "governance"
  | "infrastructure";

type Urgency = "critical" | "important" | "standard";

interface Ministry {
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

interface Release {
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

interface MinistryEvent {
  min: string;
  date: string;
  title: string;
  where: string;
}

interface PressArchiveItem {
  slug: string;
  title: string;
  date: string;
  cat: string;
  ministry: string;
  p: string;
  img: string;
  href: string;
  body?: string;
}

interface UmcApi {
  t: (key: string) => string;
  applyI18n: () => void;
  getLang: () => Lang;
  setLang: (next: string | null, opts?: { toast?: boolean }) => void;
}

interface Grecaptcha {
  getResponse(opt_widgetId?: number): string;
  reset(opt_widgetId?: number): void;
  ready(cb: () => void): void;
}

interface Window {
  UMC_I18N: Record<Lang, Record<string, string>>;
  UMC_MINISTRIES: Ministry[];
  UMC_RELEASES: Release[];
  UMC_EVENTS: MinistryEvent[];
  UMC_PRESS_ARCHIVE: PressArchiveItem[];
  UMC?: UmcApi;
  grecaptcha?: Grecaptcha;
  UMC_CHAT?: {
    reply: (q: string, lang?: Lang) => Promise<{ html: string; handoff: boolean }>;
    mount: (rootPath: string) => void;
    waHtml: (lang: Lang) => string;
  };
}
