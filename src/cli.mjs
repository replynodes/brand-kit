import fs from 'node:fs/promises';
import path from 'node:path';

const ARG_ERROR = 'brand-kit: provide exactly one bare domain, for example example.com';
const SERVICE_ERROR = 'brand-kit: the brand service could not complete the request; try again later';
const DEST_ERROR = 'brand-kit: destination ./brand already exists; remove it or choose an empty working directory';
const endpoint = 'https://brand.replynodes.com/';

const isString = value => typeof value === 'string';
const scalar = value => isString(value) ? value : null;
const cmpText = (a, b) => {
  const aa = [...String(a)], bb = [...String(b)];
  for (let i = 0; i < Math.min(aa.length, bb.length); i++) {
    const c = aa[i].codePointAt(0) - bb[i].codePointAt(0);
    if (c) return c;
  }
  return aa.length - bb.length;
};
const json = value => JSON.stringify(value, null, 2) + '\n';

function canonical(value) {
  if (Array.isArray(value)) {
    const values = value.map(canonical);
    const seen = new Set();
    return values.filter(item => {
      const key = JSON.stringify(item);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).sort((a, b) => Buffer.from(JSON.stringify(a)).compare(Buffer.from(JSON.stringify(b))));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort(cmpText).map(key => [key, canonical(value[key])]));
  }
  return value;
}

function normalizeDomain(raw) {
  if (!isString(raw)) return null;
  let value = raw.trim();
  if (!value || /[^\x00-\x7f]/.test(value) || /[\x00-\x20\x7f]/.test(value)) return null;
  value = value.toLowerCase();
  if (value.startsWith('www.')) value = value.slice(4);
  if (value.endsWith('.')) value = value.slice(0, -1);
  if (!value || value.includes(':') || value.includes('/') || value.includes('\\') || value.includes('@') || value.includes('?') || value.includes('#')) return null;
  if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(value) || /^\[[^\]]+\]$/.test(value)) return null;
  if (value.length > 253) return null;
  const labels = value.split('.');
  if (labels.length < 2 || labels.some(label => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))) return null;
  return value;
}

function list(value) { return Array.isArray(value) ? value : []; }

function normalizeSocial(value) {
  return [...new Set(list(value).filter(isString))].sort(cmpText);
}

function normalizeStyleguide(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const result = {};
  for (const key of ['domain', 'url', 'status']) if (key in value) result[key] = scalar(value[key]);
  for (const key of ['mode', 'colors', 'typography', 'buttons', 'card', 'spacing', 'shadows', 'radii']) {
    if (key in value) result[key] = value[key];
  }
  return Object.keys(result).length ? canonical(result) : null;
}

function normalizeColors(value) {
  const items = list(value).map(item => {
    const source = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
    return { hex: scalar(source.hex), usage: scalar(source.usage), count: Number.isInteger(source.count) ? source.count : null };
  });
  const key = item => [item.hex === null ? 0 : 1, item.hex === null ? '' : item.hex.toLowerCase(), item.hex ?? '', item.usage === null ? 0 : 1, item.usage === null ? '' : item.usage.toLowerCase(), item.usage ?? '', item.count === null ? 1 : 0, item.count === null ? 0 : -item.count, JSON.stringify(item)];
  items.sort((a, b) => { const ka = key(a), kb = key(b); for (let i = 0; i < ka.length; i++) { const av = ka[i], bv = kb[i]; const c = typeof av === 'number' && typeof bv === 'number' ? av - bv : cmpText(String(av), String(bv)); if (c) return c; } return 0; });
  return items.filter((item, index) => index === 0 || JSON.stringify(item) !== JSON.stringify(items[index - 1]));
}

function normalizeFonts(value) {
  const fonts = [...new Set(list(value).filter(isString))];
  return fonts.sort((a, b) => cmpText(a.toLocaleLowerCase('en-US'), b.toLocaleLowerCase('en-US')) || cmpText(a, b));
}

function sourceValue(value) { return isString(value) ? value : null; }
function normalizeAssetList(value) {
  const assets = list(value).map(item => {
    const source = item && typeof item === 'object' && !Array.isArray(item) ? item : {};
    return { url: sourceValue(source.url), kind: sourceValue(source.kind) };
  });
  const compare = (a, b) => {
    const fields = [['url', true], ['kind', true]];
    for (const [field, nullFirst] of fields) {
      const av = a[field], bv = b[field];
      if (av === null || bv === null) { if (av === bv) continue; return av === null === nullFirst ? -1 : 1; }
      const c = cmpText(String(av), String(bv)); if (c) return c;
    }
    return cmpText(JSON.stringify(a), JSON.stringify(b));
  };
  assets.sort(compare);
  return assets.filter((item, i) => i === 0 || JSON.stringify(item) !== JSON.stringify(assets[i - 1]));
}

function normalizeResponse(data, domain) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || !isString(data.domain) || !isString(data.url) || !data.meta || typeof data.meta !== 'object' || Array.isArray(data.meta)) return null;
  const stableMeta = {};
  for (const key of ['domain', 'cache_ttl_seconds', 'source', 'docs']) if (key in data.meta && key !== 'cached' && key !== 'fetched_at') stableMeta[key] = canonical(data.meta[key]);
  const colors = normalizeColors(data.colors);
  const fonts = normalizeFonts(data.fonts);
  const assets = normalizeAssetList(data.logos);
  const backdrops = normalizeAssetList(data.backdrops);
  return {
    brand: { schema_version: '0.1', domain: data.domain, url: data.url, name: scalar(data.name), description: scalar(data.description), favicon: scalar(data.favicon), og_image: scalar(data.og_image), social_links: normalizeSocial(data.social_links), styleguide: normalizeStyleguide(data.styleguide), meta: stableMeta },
    colors: { schema_version: '0.1', colors },
    fonts: { schema_version: '0.1', fonts },
    logos: { schema_version: '0.1', primary_logo: sourceValue(data.primary_logo), logos: assets, backdrops },
    domain,
    sourceUrl: data.url
  };
}

function cssString(value) {
  return '"' + [...value].map(char => { const code = char.codePointAt(0); if (char === '\\') return '\\\\'; if (char === '"') return '\\"'; if (code < 0x20 || code === 0x7f) return `\\${code.toString(16)} `; return char; }).join('') + '"';
}

function tokens(data) {
  const lines = ['/* Brand Kit tokens v0.1: generated from available source signals. */'];
  const vars = [];
  const seenColors = new Set();
  let colorIndex = 0;
  for (const item of data.colors.colors) {
    if (item.hex === null) continue;
    const colorKey = item.hex.toLowerCase();
    if (seenColors.has(colorKey)) continue;
    seenColors.add(colorKey);
    colorIndex += 1;
    vars.push(`  --brand-color-${colorIndex}: ${/^#[0-9a-fA-F]{3,8}$/.test(item.hex) ? item.hex : cssString(item.hex)};`);
  }
  for (let i = 0; i < data.fonts.fonts.length; i++) vars.push(`  --brand-font-${i + 1}: ${cssString(data.fonts.fonts[i])};`);
  if (!vars.length) lines.push('/* No color or font tokens were available. */');
  lines.push(':root {', ...vars, '}');
  return lines.join('\n') + '\n';
}

function markdown(data) {
  const b = data.brand, style = b.styleguide;
  const lines = [`# Design notes for ${data.domain}`, '', '## Summary', '', b.description ?? 'Unavailable.', '', '## Colors', ''];
  if (data.colors.colors.length) for (const item of data.colors.colors) lines.push(`- ${item.hex ?? 'Unavailable'} — ${item.usage ?? 'usage unavailable'}${item.count === null ? '' : ` (${item.count})`}`); else lines.push('- Unavailable.');
  lines.push('', '## Typography', '');
  if (data.fonts.fonts.length) for (const font of data.fonts.fonts) lines.push(`- ${font}`); else lines.push('- Unavailable.');
  lines.push('', '## Logos and assets', '', `- Primary logo: ${data.logos.primary_logo ?? 'Unavailable.'}`);
  if (data.logos.logos.length) for (const item of data.logos.logos) lines.push(`- Logo: ${item.url ?? 'Unavailable'} (${item.kind ?? 'kind unavailable'})`);
  if (data.logos.backdrops.length) for (const item of data.logos.backdrops) lines.push(`- Backdrop: ${item.url ?? 'Unavailable'} (${item.kind ?? 'kind unavailable'})`);
  if (!data.logos.logos.length && !data.logos.backdrops.length) lines.push('- Additional assets unavailable.');
  lines.push('', '## Styleguide', '', style ? `- Status: ${style.status ?? 'available'}` : '- Unavailable or omitted by the source.', '');
  if (style) for (const key of ['mode', 'colors', 'typography', 'buttons', 'card', 'spacing', 'shadows', 'radii']) if (key in style) lines.push(`- ${key}: ${JSON.stringify(style[key])}`);
  lines.push('', '## Provenance and limitations', '', `- Aggregate URL: ${b.url}`, '- Source URLs and assets are references only; no logo binary, font, or other asset was fetched.', '- The package reflects available public source signals. Optional fields may be unavailable; no recommendations or volatile metadata are included.', '');
  return lines.join('\n');
}

async function request(domain) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint + encodeURIComponent(domain), { method: 'GET', headers: { Accept: 'application/json' }, signal: controller.signal, redirect: 'error' });
    if (!response.ok) throw new Error('status');
    const data = await response.json();
    return normalizeResponse(data, domain);
  } finally { clearTimeout(timer); }
}

async function exists(file) { try { await fs.lstat(file); return true; } catch { return false; } }

function sameIdentity(actual, expected) {
  return actual.dev === expected.dev && actual.ino === expected.ino;
}

async function removeOwnedDestination(destination, destinationIdentity, files) {
  for (const [file, identity] of files.reverse()) {
    try {
      const current = await fs.lstat(file);
      if (sameIdentity(current, identity)) await fs.unlink(file);
    } catch {}
  }
  try {
    const current = await fs.lstat(destination);
    if (sameIdentity(current, destinationIdentity)) await fs.rmdir(destination);
  } catch {}
}

export async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) { process.stderr.write(ARG_ERROR + '\n'); process.exitCode = 2; return; }
  const domain = normalizeDomain(args[0]);
  if (!domain) { process.stderr.write(ARG_ERROR + '\n'); process.exitCode = 2; return; }
  const destination = path.resolve('brand');
  if (await exists(destination)) { process.stderr.write(DEST_ERROR + '\n'); process.exitCode = 4; return; }
  let data;
  try { data = await request(domain); if (!data) throw new Error('malformed'); } catch { process.stderr.write(SERVICE_ERROR + '\n'); process.exitCode = 3; return; }
  const stage = await fs.mkdtemp(path.resolve('.brand-stage-'));
  let reserved = false;
  let destinationIdentity;
  let destinationConflict = false;
  const committed = [];
  try {
    const files = { 'brand.json': json(data.brand), 'colors.json': json(data.colors), 'fonts.json': json(data.fonts), 'logos.json': json(data.logos), 'tokens.css': tokens(data), 'DESIGN.md': markdown(data) };
    for (const [name, content] of Object.entries(files)) await fs.writeFile(path.join(stage, name), content, 'utf8');
    try {
      await fs.mkdir(destination);
      reserved = true;
      destinationIdentity = await fs.lstat(destination);
    } catch (error) {
      if (error?.code === 'EEXIST') {
        await fs.rm(stage, { recursive: true, force: true }).catch(() => {});
        process.stderr.write(DEST_ERROR + '\n'); process.exitCode = 4; return;
      }
      throw error;
    }
    for (const name of Object.keys(files)) {
      const target = path.join(destination, name);
      try {
        await fs.copyFile(path.join(stage, name), target, fs.constants.COPYFILE_EXCL);
      } catch (error) {
        if (error?.code === 'EEXIST') destinationConflict = true;
        throw error;
      }
      committed.push([target, await fs.lstat(target)]);
    }
  } catch {
    await fs.rm(stage, { recursive: true, force: true }).catch(() => {});
    if (reserved) await removeOwnedDestination(destination, destinationIdentity, committed);
    process.stderr.write(destinationConflict ? DEST_ERROR + '\n' : SERVICE_ERROR + '\n');
    process.exitCode = destinationConflict ? 4 : 3; return;
  }
  await fs.rm(stage, { recursive: true, force: true });
  process.stdout.write('Brand kit written to ./brand/ (6 files)\n');
}
