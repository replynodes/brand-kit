# Launch demo

Run the published package against a public domain:

```sh
npx --yes @replynodes/brand-kit@0.1.2 <domain>
```

The terminal smoke demo runs the same command in a temporary directory and checks the result:

```sh
./examples/launch/terminal-demo.sh
./examples/launch/terminal-demo.sh vercel.com
```

It creates exactly six artifacts in `./brand/`:

- `DESIGN.md` — concise human-readable design guidance.
- `brand.json` — the normalized domain and brand URL.
- `colors.json` — referenced color data.
- `fonts.json` — referenced font data.
- `logos.json` — referenced logo references.
- `tokens.css` — CSS custom properties for the available tokens.

The launch is limited to public domains, Node.js `>=20.19.0`, and one HTTPS aggregate request. This is references-only: optional signals can be unavailable, and the client does not download logos, fonts, or other binary assets. It requires no signup, API key, cookies, or telemetry. An existing `./brand` directory is not overwritten.

Any recorded output must come from the script or a live run; do not fabricate output.

Suggested launch copy:

> Generate a deterministic, agent-ready brand context package from a public domain with one command: `npx --yes @replynodes/brand-kit@0.1.2 example.com`. It writes six references-only brand artifacts for agents, design handoff, and CSS/token work.

This is a demo only; do not submit it externally from this repository.
