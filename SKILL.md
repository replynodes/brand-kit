---
name: brand-kit
description: Generate and consume a ReplyNodes brand context package for UI, design, content, and handoff work.
---

# Brand Kit

## WHEN TO USE

Use this skill when:

- brand context is needed before UI work;
- a brand kit is requested from a URL or domain;
- CSS or design tokens are needed;
- `DESIGN.md` is needed for coding agents;
- slides, reports, or email need reusable brand references; or
- logos, colors, fonts, or styleguide signals need to be extracted.

## Contract

Use exactly one bare domain:

```sh
npx @replynodes/brand-kit <bare-domain>
```

For a source checkout, use this distinct fallback:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs <bare-domain>
```

The client makes one aggregate `GET https://brand.replynodes.com/{bare-domain}` and writes exactly six files in `./brand/`:

- `brand.json`
- `colors.json`
- `fonts.json`
- `logos.json`
- `tokens.css`
- `DESIGN.md`

Consume generated `tokens.css` and the JSON/Markdown artifacts in downstream work. Logo, backdrop, font, and other asset values are reference-only URLs or source signals: the client does not download or decode binaries.

Optional source fields can be missing, partial, or unavailable; preserve those semantics rather than inventing values. Empty token output and `Unavailable.` notes are valid results. The client accepts one normalized ASCII bare domain, rejects an existing `./brand` destination, follows no redirects, and uses no credentials, cookies, API keys, scraping, per-capability requests, telemetry, video, MCP, or backend routes.

The service remains authoritative for public-address and SSRF checks. Results reflect available public source signals and are not a guarantee of completeness or freshness.

Canonical repository: https://github.com/replynodes/brand-kit

Canonical guide: https://docs.replynodes.com/docs/guides/brand-kit
