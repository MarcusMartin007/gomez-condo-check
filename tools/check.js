// Smoke test for the condo check page. Must print CHECK PASSED before any push.
// Run: NODE_PATH=/opt/npm-tools/node_modules node tools/check.js
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.join(__dirname, "..", "public");
const fails = [];
const fail = (m) => fails.push(m);

// Copy rules on every HTML file.
const BANNED = [
  [/—|–/, "em or en dash"],
  [/carolynsellstpete/i, "domain typo (single s)"],
  [/RE\/MAX Metro/i, "wrong brokerage"],
  [/herrell/i, "Herrell reference"],
  [/\b(agency|consultant|freelancer|full-service|AI-powered)\b/i, "positioning word"],
  [/\b(stunning|nestled|dream home|must see)\b/i, "banned listing word"],
  [/\b(kids?|children|families|family-friendly|safe neighborhood)\b/i, "fair housing language"],
];
const REQUIRED = {
  "index.html": ["RE/MAX Action First", "Equal Housing Opportunity", "not legal, inspection or engineering advice", "CarolynSellsStPete.com", 'name="condo-check"', 'netlify-honeypot="company"', 'value="Condo building check request"', 'name="robots" content="noindex'],
  "thanks.html": ["RE/MAX Action First", "Equal Housing Opportunity", "within one business day"],
};
for (const f of ["index.html", "thanks.html"]) {
  const html = fs.readFileSync(path.join(ROOT, f), "utf8");
  const text = html.replace(/<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>/g, "");
  for (const [re, why] of BANNED) if (re.test(text)) fail(`${f}: ${why} (${text.match(re)[0]})`);
  for (const s of REQUIRED[f]) if (!html.includes(s)) fail(`${f}: missing "${s}"`);
  for (const m of html.matchAll(/(?:src|href)="((?:img|fonts)\/[^"]+)"/g)) if (!fs.existsSync(path.join(ROOT, m[1]))) fail(`${f}: missing file ${m[1]}`);
}

(async () => {
  const b = await chromium.launch();
  for (const w of [1280, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    p.on("pageerror", (e) => errs.push(e.message));
    await p.goto("file://" + path.join(ROOT, "index.html") + "?src=facebook");
    await p.evaluate(() => document.fonts.ready);
    if (errs.length) fail(`${w}: script error ${errs[0]}`);
    const r = await p.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      source: document.querySelector("#cc").elements.source.value,
      role: document.querySelector("#cc").elements.role.value,
      unitHidden: document.getElementById("unit-f").hidden,
    }));
    if (r.overflow) fail(`${w}: horizontal overflow`);
    if (r.source !== "Facebook") fail(`${w}: source tag reads ${r.source}`);
    if (r.role !== "Looking at a condo") fail(`${w}: default role is ${r.role}`);
    if (!r.unitHidden) fail(`${w}: unit field visible for buyers`);
    await p.click("text=I own a condo");
    if (await p.evaluate(() => document.getElementById("unit-f").hidden)) fail(`${w}: unit field stays hidden for owners`);
    await p.screenshot({ path: path.join(__dirname, "..", "_build", `shot-${w}.png`), fullPage: true });
    await p.close();
  }
  await b.close();
  if (fails.length) { console.log("CHECK FAILED\n- " + fails.join("\n- ")); process.exit(1); }
  console.log("CHECK PASSED");
})();
