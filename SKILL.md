# @replynodes/brand-kit

Use the public npm package with one bare domain:

```sh
npx @replynodes/brand-kit example.com
```

The package is scoped, but its installed executable remains `brand-kit`:

```sh
npm install -g @replynodes/brand-kit
brand-kit example.com
```

The client makes one HTTPS GET to `https://brand.replynodes.com/{bare-domain}` and writes the deterministic brand artifacts locally. It requires no API key or signup, does not download binary assets, and does not claim capabilities beyond this service boundary. The v0.1.1 npm publication is the release target and has not yet occurred.
