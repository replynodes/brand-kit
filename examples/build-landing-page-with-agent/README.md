# Build a landing page with an agent

Use `vercel.com` to gather brand context before implementing a landing page.

```sh
npx @replynodes/brand-kit vercel.com
```

For a source checkout, use this distinct fallback:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs vercel.com
```

Expected output in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`.

Consumer workflow: read `DESIGN.md` and the JSON context before UI work, use `tokens.css` for available colors and fonts, and treat logo URLs as references when selecting imagery.

Limitations: the client performs one aggregate GET, uses no credentials, does not fetch or decode asset binaries, and source fields may be missing, partial, or unavailable. An existing `./brand` directory is rejected.
