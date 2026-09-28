#!/usr/bin/env node
import { main } from '../src/cli.mjs';

main().catch(() => {
  process.stderr.write('brand-kit: the brand service could not complete the request; try again later\n');
  process.exitCode = 3;
});
