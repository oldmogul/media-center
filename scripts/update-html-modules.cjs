const fs = require("fs");
const path = require("path");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "refs" || e.name === "src") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".html")) out.push(p);
  }
  return out;
}

const root = path.join(__dirname, "..");
for (const file of walk(root)) {
  let s = fs.readFileSync(file, "utf8");
  const orig = s;
  s = s.replace(/<script src="(\.\.\/)?js\/i18n\.js"><\/script>\s*\r?\n\s*/g, "");
  s = s.replace(/<script src="(\.\.\/)?js\/ministries-data\.js"><\/script>\s*\r?\n\s*/g, "");
  s = s.replace(/<script src="((?:\.\.\/)?js\/[^"]+\.js)"><\/script>/g, '<script type="module" src="$1"></script>');
  if (s !== orig) {
    fs.writeFileSync(file, s);
    console.log("updated", path.relative(root, file));
  }
}
