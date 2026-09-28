# Generate a brand kit

Generate a reference package for `linear.app`.

```sh
npx brand-kit linear.app
```

The intended npm command is shown above, but clean npm use is blocked until #561 publishes the package. The truthful source invocation is:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs linear.app
```

Expected output in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`.

Consumer workflow: inspect the six artifacts as a single package, use structured JSON for automation, and use `DESIGN.md` for a readable summary and provenance.

Limitations: one aggregate GET is made to the hosted service; no credentials, scraping, redirects, or asset downloads are used. Values can be missing, partial, or unavailable, and an existing `./brand` destination is rejected.
