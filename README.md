# Carolyn Gomez: Pinellas condo building check

Public request page for The Gomez Group (Carolyn Gomez, REALTOR®, RE/MAX Action First). A buyer or owner sends a building name; Carolyn replies within one business day with what that building should have on file and what to ask for.

Own repo, own Netlify project. Nothing is shared with Lari Averbeck's repo or with The Herrell Group.

## Files

- `public/index.html`: the page and the Netlify form `condo-check`.
- `public/thanks.html`: no-JavaScript fallback after submit.
- `public/img/`: `mark.png`, `mark-reversed.png`, `carolyn.jpg`, `share.jpg`.
- `public/fonts/`: Cardo and Inter, subset to woff2.
- `_build/share.html`, `render.js`: the 1200 x 630 share image.
- `tools/check.js`: copy rules, files, source tagging, owner-only unit field, overflow at 1280 and 390.

## Rules

- Run `NODE_PATH=/opt/npm-tools/node_modules node tools/check.js` before every push. It must print CHECK PASSED.
- No em or en dashes. CarolynSellsStPete.com with a double s. RE/MAX Action First, never RE/MAX Metro.
- The page is hidden from search until Carolyn approves it: delete the robots line marked `LAUNCH`.
- If the address changes to a custom domain, update `canonical` and `og:url` and re-render the share image.

## Form

Hidden fields: `subject` ("Condo building check request"), `source` (from `?src=` or the referrer, else Direct), `src_raw`, `page` (`condo-building-check`), `submitted_at`. Honeypot: `company`.

Tracking links use `?src=`: instagram, facebook, google, email, referral, qr, partner.

## Alerts

Netlify can only email team members, so the form notification goes to marcus@pelicanpanachemarketing.com. Forwarding to Carolyn is on hold until she and Lari approve it.
