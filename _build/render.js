// Renders public/img/share.jpg (1200 x 630) from _build/share.html.
// Run: cd _build && NODE_PATH=/opt/npm-tools/node_modules node render.js
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.goto("file://" + path.join(__dirname, "share.html"));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  await p.screenshot({ path: path.join(__dirname, "..", "public", "img", "share.jpg"), type: "jpeg", quality: 86 });
  await b.close();
  console.log("share.jpg written");
})();
