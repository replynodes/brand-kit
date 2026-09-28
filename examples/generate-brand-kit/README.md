# Generate a brand kit for linear.app

Create an agent-ready local brand context package from Linear’s public domain:

```sh
npx @replynodes/brand-kit linear.app
```

The package is scoped as `@replynodes/brand-kit`. Version `0.1.1` publication is
the release target and has not happened. At runtime, the client makes one GET to
`https://brand.replynodes.com/linear.app`; no API key or signup is required, and
no binary downloads are involved.
