# Build a landing page with an agent

Use `vercel.com` to gather brand context before implementing a landing page.

```sh
npx brand-kit vercel.com
```

The intended npm command is shown above, but clean npm use is blocked until #561 publishes the package. The truthful source invocation is:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs vercel.com
```

Expected output in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`.

Consumer workflow: read `DESIGN.md` and the JSON context before UI work, use `tokens.css` for available colors and fonts, and treat logo URLs as references when selecting imagery.

Limitations: the client performs one aggregate GET, uses no credentials, does not fetch or decode asset binaries, and source fields may be missing, partial, or unavailable. An existing `./brand` directory is rejected.
