# brand-kit

Turn a public domain into a deterministic, agent-ready brand context package in one command.

## Intended package command

Npm publication is currently unavailable/E404 pending #561; this is the intended command once the package is published:

```sh
npx brand-kit linear.app
```

## Install and run

Npm publication is currently unavailable/E404 pending #561. The truthful source/clone path is:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs example.com
```

The intended package command is exactly `npx brand-kit <bare-domain>`, but clean npm use is pending #561. Pass exactly one bare domain. The client supports Node.js `>=20.19.0`; CI verifies Node 20.x and 22.x, without claiming every OS combination is tested.

## Discovery links

- [Agent skill](SKILL.md)
- [Machine-readable guidance](llms.txt)
- [Discovery examples](examples/)

## Approved use cases

These are the approved launch-story command forms; the npm path remains pending #561.

- Agent-ready brand context: `npx brand-kit linear.app`
- On-brand landing-page bootstrap: `npx brand-kit vercel.com`
- CSS/token handoff: `npx brand-kit stripe.com`
- Reusable reference package for slides/reports/email: `npx brand-kit github.com`
- Portable design handoff/audit: `npx brand-kit notion.so`

## Artifacts

The command creates exactly six files in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`. Output is staged, then committed only after `./brand/` is exclusively reserved; existing destinations and files are never overwritten.

## Limitations and non-goals

This is a references-only client: it does not download or decode logos, fonts, or other binaries; scrape pages; follow redirects; sign up; accept API keys; send cookies; make per-capability requests; or provide video, Tailwind, MCP, or telemetry features. Optional source signals can be unavailable. The hosted service remains authoritative for public-address and SSRF checks.

## How it works

The CLI validates one normalized ASCII bare domain, makes one timed HTTPS GET to `https://brand.replynodes.com/{domain}`, normalizes the aggregate response, and writes stable JSON, CSS, and Markdown artifacts. The client uses only Node.js built-ins.

## Attribution and service boundary

The client in this repository is MIT-licensed. The hosted aggregate service at `brand.replynodes.com` is a proprietary ReplyNodes service with its own availability and terms; it is not bundled with, relicensed by, or made open source through this repository. See `NOTICE.md`.

## Contribution and release notes

See `CONTRIBUTING.md` for checks and contribution boundaries. CI runs smoke/contract checks on Node 20.x and 22.x. A future release workflow is manually triggerable for SemVer npm trusted publishing with provenance; this initial issue does not publish a release.
