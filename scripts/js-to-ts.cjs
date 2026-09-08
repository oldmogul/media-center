const fs = require("fs");
const path = require("path");

const jsDir = path.join(__dirname, "..", "js");
const srcDir = path.join(__dirname, "..", "src");
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir, { recursive: true });

function stripIife(s) {
  s = s.replace(/^\uFEFF/, "");
  s = s.replace(/^\(async function \(\) \{\r?\n/, "");
  s = s.replace(/^\(function \(\) \{\r?\n/, "");
  s = s.replace(/\r?\n\}\)\(\);\s*$/, "\n");
  return s;
}

function asEl(name) {
  return `(${name}.target instanceof Element ? ${name}.target : null)`;
}

const files = fs.readdirSync(jsDir).filter((f) => f.endsWith(".js"));
for (const f of files) {
  let s = fs.readFileSync(path.join(jsDir, f), "utf8");
  const name = f.replace(/\.js$/, "");

  if (name === "i18n") {
    s = `import type { Lang } from "./types.js";\n\nexport const UMC_I18N: Record<Lang, Record<string, string>> = ` + s.replace(/^window\.UMC_I18N = /, "");
  } else if (name === "ministries-data") {
    s =
      `import type { Ministry, Release, MinistryEvent } from "./types.js";\n\n` +
      s
        .replace(/^window\.UMC_MINISTRIES = /, "export const UMC_MINISTRIES: Ministry[] = ")
        .replace(/\nwindow\.UMC_RELEASES = /, "\n\nexport const UMC_RELEASES: Release[] = ")
        .replace(/\nwindow\.UMC_EVENTS = /, "\n\nexport const UMC_EVENTS: MinistryEvent[] = ");
  } else {
    s = stripIife(s);
    if (name === "app") {
      s =
        `import { UMC_I18N } from "./i18n.js";\nimport type { Lang } from "./types.js";\n\n` +
        s
          .replace(/const I18N = window\.UMC_I18N \|\| \{ en: \{\} \};/, "const I18N = UMC_I18N;")
          .replace(/const LANGS = \["en", "lg", "sw"\];/, 'const LANGS: Lang[] = ["en", "lg", "sw"];')
          .replace(/function getLang\(\) \{/, "function getLang(): Lang {")
          .replace(/return LANGS\.includes\(saved\) \? saved : "en";/, 'return LANGS.includes(saved as Lang) ? (saved as Lang) : "en";')
          .replace(/if \(q && LANGS\.includes\(q\)\) return q;/, "if (q && LANGS.includes(q as Lang)) return q as Lang;")
          .replace(/function t\(key\) \{/, "function t(key: string): string {")
          .replace(/function setLang\(next, \{ toast \} = \{ toast: true \}\) \{/, "function setLang(next: string | null, { toast }: { toast?: boolean } = { toast: true }): void {")
          .replace(/if \(!LANGS\.includes\(next\) \|\| next === lang\) \{/, "if (!next || !LANGS.includes(next as Lang) || next === lang) {")
          .replace(/lang = next;/, "lang = next as Lang;")
          .replace(/function closeDrops\(except\) \{/, "function closeDrops(except?: Element | null): void {")
          .replace(/const btn = e\.target\.closest\("\[data-set-lang\]"\);/, 'const btn = e.target instanceof Element ? e.target.closest("[data-set-lang]") : null;')
          .replace(/function setNavOpen\(open\) \{/, "function setNavOpen(open: boolean): void {")
          .replace(/window\.UMC = \{ t, applyI18n, getLang: \(\) => lang, setLang \};/, "window.UMC = { t, applyI18n, getLang: () => lang, setLang };");
    }
    if (name === "ministries") {
      s = `import { UMC_RELEASES } from "./ministries-data.js";\n\n` + s.replace(/const releases = window\.UMC_RELEASES \|\| \[\];/, "const releases = UMC_RELEASES;");
    }
    if (name === "ministry") {
      s =
        `import { UMC_MINISTRIES, UMC_RELEASES, UMC_EVENTS } from "./ministries-data.js";\nimport { UMC_I18N } from "./i18n.js";\nimport type { Lang, Sector } from "./types.js";\n\n` +
        s
          .replace(/const mins = window\.UMC_MINISTRIES \|\| \[\];/, "const mins = UMC_MINISTRIES;")
          .replace(/const releases = window\.UMC_RELEASES \|\| \[\];/, "const releases = UMC_RELEASES;")
          .replace(/const events = window\.UMC_EVENTS \|\| \[\];/, "const events = UMC_EVENTS;")
          .replace(/const I = window\.UMC_I18N \|\| \{\};/, "const I = UMC_I18N;");
    }
  }

  fs.writeFileSync(path.join(srcDir, name + ".ts"), s);
  console.log("wrote src/" + name + ".ts", s.length);
}
console.log("done");
