# CSS token handoff

Prepare a token handoff for `stripe.com`.

```sh
npx brand-kit stripe.com
```

The intended npm command is shown above, but clean npm use is blocked until #561 publishes the package. The truthful source invocation is:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs stripe.com
```

Expected output in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`.

Consumer workflow: consume the generated `tokens.css` in the stylesheet or map its variables into the project’s existing token system; use the JSON files to inspect provenance. Do not add a CLI Tailwind flag.

Limitations: tokens only reflect available source signals, so missing, partial, or unavailable colors and fonts remain possible. The client makes one aggregate GET, uses no credentials, and does not fetch asset binaries.
