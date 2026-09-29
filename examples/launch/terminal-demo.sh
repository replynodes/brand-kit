#!/usr/bin/env bash

set -euo pipefail

if (( $# > 1 )); then
  printf 'Usage: %s [domain]\n' "$0" >&2
  exit 2
fi

domain=${1:-linear.app}
work_dir=$(mktemp -d)
npm_user_config="$work_dir/npmrc"
npm_cache="$work_dir/npm-cache"

cleanup() {
  rm -rf "$work_dir"
}
trap cleanup EXIT

: > "$npm_user_config"

printf 'Running in temporary directory: %s\n' "$work_dir"
printf '+ npx --yes @replynodes/brand-kit@0.1.2 %q\n' "$domain"

set +e
(
  cd "$work_dir"
  npm_config_userconfig="$npm_user_config" \
    npm_config_cache="$npm_cache" \
    npm_config_audit=false \
    npm_config_fund=false \
    npm_config_update_notifier=false \
    npm_config_progress=false \
    timeout --signal=TERM --kill-after=5s 90s \
      npx --yes @replynodes/brand-kit@0.1.2 "$domain"
)
status=$?
set -e

printf 'Command exit status: %d\n' "$status"
if (( status != 0 )); then
  printf 'Error: launch command failed.\n' >&2
  exit "$status"
fi

cd "$work_dir"
node --input-type=module - <<'NODE'
import { readdir, readFile } from 'node:fs/promises';

const expected = new Set([
  'DESIGN.md',
  'brand.json',
  'colors.json',
  'fonts.json',
  'logos.json',
  'tokens.css',
]);
const entries = await readdir('./brand', { withFileTypes: true });
const actual = entries.map((entry) => entry.name).sort();
const expectedNames = [...expected].sort();

if (entries.length !== expected.size || actual.some((name, index) => name !== expectedNames[index])) {
  throw new Error(`./brand must contain exactly: ${expectedNames.join(', ')}`);
}
if (entries.some((entry) => !entry.isFile())) {
  throw new Error('./brand must contain only regular files');
}

const readJson = async (name) => {
  try {
    return JSON.parse(await readFile(`./brand/${name}`, 'utf8'));
  } catch (error) {
    throw new Error(`could not parse ./brand/${name}: ${error.message}`);
  }
};
const json = Object.fromEntries(
  await Promise.all(['brand.json', 'colors.json', 'fonts.json', 'logos.json'].map(async (name) => [name, await readJson(name)])),
);

for (const [name, value] of Object.entries(json)) {
  if (value.schema_version !== '0.1') {
    throw new Error(`./brand/${name} must have schema_version "0.1"`);
  }
}
if (typeof json['brand.json'].domain !== 'string' || typeof json['brand.json'].url !== 'string') {
  throw new Error('./brand/brand.json must have string domain and url');
}
for (const name of ['colors.json', 'fonts.json', 'logos.json']) {
  const key = name.slice(0, -5);
  if (!Array.isArray(json[name][key])) {
    throw new Error(`./brand/${name} must have an array at ${key}`);
  }
}

console.log('Verified ./brand: exactly six regular files and the required JSON shape.');
NODE
