# Design handoff audit

Audit available design signals for `notion.so`.

```sh
npx brand-kit notion.so
```

The intended npm command is shown above, but clean npm use is blocked until #561 publishes the package. The truthful source invocation is:

```sh
git clone https://github.com/replynodes/brand-kit.git
cd brand-kit
npm ci
node bin/brand-kit.mjs notion.so
```

Expected output in `./brand/`: `brand.json`, `colors.json`, `fonts.json`, `logos.json`, `tokens.css`, and `DESIGN.md`.

Consumer workflow: compare `DESIGN.md` with the JSON source fields, review `tokens.css` for usable variables, and record unavailable signals as gaps in the handoff rather than filling them in.

Limitations: the client makes one aggregate GET, uses no credentials, does not scrape or fetch binaries, and can return missing, partial, or unavailable source signals. An existing `./brand` destination is rejected.
