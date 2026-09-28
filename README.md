# brand-kit

Turn a public domain into a deterministic, agent-ready brand context package in one command.

## 10-second demo

```sh
npx @replynodes/brand-kit linear.app
cat brand/brand.json
```

## Install and run

```sh
npm install -g @replynodes/brand-kit
brand-kit example.com
```

The package is scoped as `@replynodes/brand-kit`, while the installed executable remains `brand-kit`.

Pass exactly one bare domain. The client supports Node.js `>=20.19.0` on Linux x64/arm64, macOS x64/arm64, and Windows x64. CI verifies Node 20.x and 22.x; that does not claim every OS combination is tested.

## Approved use cases

- Agent-ready brand context: `npx @replynodes/brand-kit linear.app`
- On-brand landing-page bootstrap: `npx @replynodes/brand-kit vercel.com`
- CSS/token handoff: `npx @replynodes/brand-kit stripe.com`
- Reusable reference package for slides/reports/email: `npx @replynodes/brand-kit github.com`
- Portable design handoff/audit: `npx @replynodes/brand-kit notion.so`

## Artifacts

The command creates exactly six files in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`. Output is staged, then committed only after `./brand/` is exclusively reserved; existing destinations and files are never overwritten.

## Limitations and non-goals

This is a references-only client: it does not download or decode logos, fonts, or other binaries; scrape pages; follow redirects; sign up; accept API keys; send cookies; make per-capability requests; or provide video, Tailwind, MCP, or telemetry features. Optional source signals can be unavailable. The hosted service remains authoritative for public-address and SSRF checks.

## How it works

The CLI validates one normalized ASCII bare domain, makes one timed HTTPS GET to `https://brand.replynodes.com/{domain}`, normalizes the aggregate response, and writes stable JSON, CSS, and Markdown artifacts. The client uses only Node.js built-ins.

## Attribution and service boundary

The client in this repository is MIT-licensed. The hosted aggregate service at `brand.replynodes.com` is a proprietary ReplyNodes service with its own availability and terms; it is not bundled with, relicensed by, or made open source through this repository. See `NOTICE.md`.

## Contribution and release notes

See `CONTRIBUTING.md` for checks and contribution boundaries. CI runs smoke/contract checks on Node 20.x and 22.x. The published scoped npm release is `@replynodes/brand-kit@0.1.1`; v0.1.2 is an unpublished patch replacement adding npm discovery keywords.
