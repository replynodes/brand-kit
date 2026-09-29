# CSS token handoff

Prepare a token handoff for `stripe.com`.

```sh
npx @replynodes/brand-kit stripe.com
```

For a source checkout, use this distinct fallback:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs stripe.com
```

Expected output in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`.

Consumer workflow: consume the generated `tokens.css` in the stylesheet or map its variables into the project’s existing token system; use the JSON files to inspect provenance.

Limitations: tokens only reflect available source signals, so missing, partial, or unavailable colors and fonts remain possible. The client makes one aggregate GET, uses no credentials, and does not fetch asset binaries.
