const fs = require("fs");
const path = require("path");
const dir = path.join(__dirname, "..", "src");
const skip = new Set(["types.ts", "i18n.ts", "ministries-data.ts"]);

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".ts"))) {
  if (skip.has(f)) continue;
  let s = fs.readFileSync(path.join(dir, f), "utf8");
  if (s.includes("function init(): void")) continue;
  const importBlock = [];
  const lines = s.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && (lines[i].startsWith("import ") || lines[i].trim() === "")) {
    importBlock.push(lines[i]);
    i++;
  }
  const rest = lines.slice(i).join("\n").replace(/\s+$/, "");
  const out =
    (importBlock.length ? importBlock.join("\n") + "\n\n" : "") +
    "function init(): void {\n" +
    rest +
    "\n}\n\ninit();\n";
  fs.writeFileSync(path.join(dir, f), out);
  console.log("wrapped", f);
}
