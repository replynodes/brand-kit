# Contributing

Contributions are welcome through GitHub issues and pull requests in `replynodes/brand-kit`. Open or find an issue first, explain the proposed change, and reference it from the PR. `main` is protected: changes require maintainer review and the required checks before merge. This project does not require a CLA.

Keep the CLI dependency-free, deterministic, and within the public client contract. Before opening a PR, run the exact checks below:

```sh
node --check src/cli.mjs
node --check bin/brand-kit.mjs
node --check scripts/smoke.mjs
npm run package-shape
npm run smoke
```

The smoke command is the real black-box check against the public service. Do not add unit, white-box, per-function, or coverage-only tests; add a black-box smoke probe only when a behavior cannot be covered by the existing smoke. Do not add credentials, fixtures, telemetry, or backend changes.
