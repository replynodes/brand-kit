#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const expectedFiles = ['DESIGN.md', 'brand.json', 'colors.json', 'fonts.json', 'logos.json', 'tokens.css'];
const SMOKE_ERROR = 'brand-kit smoke: verification failed\n';

async function runCli(root, cwd, domain) {
  return await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, 'bin/brand-kit.mjs'), domain], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '', stderr = '';
    child.stdout.on('data', chunk => stdout += chunk);
    child.stderr.on('data', chunk => stderr += chunk);
    child.on('error', reject);
    child.on('close', code => resolve({ code, stdout, stderr }));
  });
}

async function assertExistingDestinationRejected(root, temp, setup, verify) {
  await fs.rm(path.join(temp, 'brand'), { recursive: true, force: true });
  await setup();
  const result = await runCli(root, temp, 'linear.app');
  assert.equal(result.code, 4);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'brand-kit: destination ./brand already exists; remove it or choose an empty working directory\n');
  await verify();
}

async function run() {
  const args = process.argv.slice(2);
  if (args.length > 1) {
    process.stderr.write('brand-kit smoke: expected at most one positional domain\n');
    return 2;
  }
  const domain = args[0] ?? process.env.BRAND_KIT_SMOKE_DOMAIN ?? 'linear.app';
  const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'brand-kit-smoke-'));
  const root = path.resolve(import.meta.dirname, '..');
  try {
    await assertExistingDestinationRejected(root, temp,
      async () => { await fs.mkdir(path.join(temp, 'brand')); await fs.writeFile(path.join(temp, 'brand', 'keep.txt'), 'keep\n'); },
      async () => assert.equal(await fs.readFile(path.join(temp, 'brand', 'keep.txt'), 'utf8'), 'keep\n'));
    await assertExistingDestinationRejected(root, temp,
      async () => { await fs.writeFile(path.join(temp, 'brand'), 'keep\n'); },
      async () => assert.equal(await fs.readFile(path.join(temp, 'brand'), 'utf8'), 'keep\n'));
    const danglingTarget = path.join(temp, 'missing-target');
    await assertExistingDestinationRejected(root, temp,
      async () => { await fs.symlink(danglingTarget, path.join(temp, 'brand')); },
      async () => assert.equal((await fs.lstat(path.join(temp, 'brand'))).isSymbolicLink(), true));

    await fs.rm(path.join(temp, 'brand'), { recursive: true, force: true });
    const result = await runCli(root, temp, domain);
    assert.equal(result.code, 0);
    assert.equal(result.stdout, 'Brand kit written to ./brand/ (6 files)\n');
    assert.equal(result.stderr, '');
    const names = (await fs.readdir(path.join(temp, 'brand'))).sort();
    assert.deepEqual(names, expectedFiles);
    const jsonFiles = ['brand.json', 'colors.json', 'fonts.json', 'logos.json'];
    const documents = Object.fromEntries(await Promise.all(jsonFiles.map(async file => [file, JSON.parse(await fs.readFile(path.join(temp, 'brand', file), 'utf8'))])));
    assert.equal(documents['brand.json'].schema_version, '0.1');
    assert.equal(typeof documents['brand.json'].domain, 'string');
    assert.equal(typeof documents['brand.json'].url, 'string');
    assert.equal(documents['colors.json'].schema_version, '0.1');
    assert.ok(Array.isArray(documents['colors.json'].colors));
    assert.equal(documents['fonts.json'].schema_version, '0.1');
    assert.ok(Array.isArray(documents['fonts.json'].fonts));
    assert.equal(documents['logos.json'].schema_version, '0.1');
    assert.ok(Array.isArray(documents['logos.json'].logos));
    for (const file of names) assert.ok((await fs.stat(path.join(temp, 'brand', file))).isFile());
    assert.equal((await fs.readdir(path.join(temp, 'brand'))).filter(name => /\.(png|jpe?g|gif|webp|woff2?|ttf|otf)$/i.test(name)).length, 0);
    console.log(`Smoke passed for ${domain} (Node ${process.versions.node}; this is a live endpoint check, not an all-OS matrix claim).`);
    return 0;
  } finally {
    await fs.rm(temp, { recursive: true, force: true });
  }
}

try {
  process.exitCode = await run();
} catch {
  process.stderr.write(SMOKE_ERROR);
  process.exitCode = 1;
}
