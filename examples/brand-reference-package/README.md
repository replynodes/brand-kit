# Brand reference package

Create reusable references for slides, reports, or email from `github.com`.

```sh
npx @replynodes/brand-kit github.com
```

For a source checkout, use this distinct fallback:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs github.com
```

Expected output in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`.

Consumer workflow: use `DESIGN.md` for editorial reference, consult the JSON files for structured colors/fonts/logo references, and use `tokens.css` when a web export needs the same available tokens.

Limitations: logo, backdrop, and font values are reference-only; no binaries are downloaded or decoded. The request is one aggregate GET with no credentials, and fields can be missing, partial, or unavailable.
