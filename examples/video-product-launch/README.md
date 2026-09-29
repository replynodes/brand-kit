# Video product launch brand context

## When to use

Use this example after a product launch has been approved, when a human or
creative agent needs a deterministic brand-context handoff for a short product
launch video. It is post-launch, non-blocking, documentation/design-only
guidance. It does not build, render, export, or publish a video, and it does
not replace creative review or product-copy approval.

## Generate the brand context

Run the exact scoped command from the project directory:

```sh
npx @replynodes/brand-kit <bare-domain>
```

Provide exactly one normalized ASCII bare domain input: a hostname such as
`example.com`, without `https://`, a path, credentials, query, fragment, port,
IP address, or other arguments. Normalization lowercases the value and removes
an optional leading `www.` and trailing dot before the request. Do not run this
example with a placeholder to manufacture brand output.

The command writes exactly these six files under `./brand/`:

| File | Relevant output used by this example |
| --- | --- |
| `brand.json` | `domain`, `url`, `name`, `description`, `favicon`, `og_image`, `social_links`, `styleguide`, and `meta` when available |
| `colors.json` | `colors[]` entries with `hex`, `usage`, and `count` |
| `fonts.json` | `fonts[]` |
| `logos.json` | `primary_logo`, `logos[]`, and `backdrops[]`; each asset entry has `url` and `kind` |
| `tokens.css` | Generated `--brand-color-N` and `--brand-font-N` variables for available color/font values |
| `DESIGN.md` | Human-readable summary, colors, typography, logos/assets, styleguide, provenance, and limitations |

## Hypothetical project structure

This is a source-layout example for an HTML/CSS/Remotion-style project. It is
not an implementation or a renderer:

```text
video-project/
├── brand/                         # generated six-file package
├── src/
│   ├── scenes/
│   │   ├── TitleIntro.tsx
│   │   ├── Product.tsx
│   │   └── CtaEndCard.tsx
│   ├── styles/brand.css            # imports ../../brand/tokens.css
│   └── content/product-copy.md     # human/creative-agent supplied copy
└── FRAME.md                       # deterministic contract below
```

The hypothetical scene source consumes the existing artifacts as follows:

- `colors.json` supplies only available `colors[].hex` values and their
  `usage`/`count` context. `tokens.css` can expose those same available values
  through its generated color variables.
- `fonts.json` supplies only the available `fonts[]` values. `tokens.css` can
  expose them through its generated font variables.
- `logos.json` supplies `primary_logo`, `logos[].url`, `logos[].kind`, and
  `backdrops[].url`/`kind` as references. A URL is not a downloaded logo or
  binary asset.
- `DESIGN.md` is the readable review handoff for the same available signals,
  including provenance and unavailable fields; it is not a new source of
  brand data.
- `brand.json` supplies identity/context fields such as `name`, `description`,
  `domain`, and `styleguide` when present. It does not supply product-launch
  copy unless that field is actually present in the package output.

### Consumer wiring sketch

The hypothetical `src/styles/brand.css` imports the generated CSS directly:

```css
@import "../../brand/tokens.css";
```

The following is wiring pseudocode, not executable renderer code. `readJson`
and `readText` mean “read the local generated artifact”; they do not fetch
URLs. `available` preserves a source value and returns the literal marker
`unavailable` only for a missing, null, or empty scalar. Arrays are preserved,
including empty arrays, so no brand data is fabricated.

```text
brand       = readJson("./brand/brand.json")
colorsFile  = readJson("./brand/colors.json")
fontsFile   = readJson("./brand/fonts.json")
logosFile   = readJson("./brand/logos.json")
reviewNotes = readText("./brand/DESIGN.md")

brandContext = {
  domain:      available(brand.domain),
  name:        available(brand.name),
  description: available(brand.description),
  styleguide:  available(brand.styleguide),
  colors:      colorsFile.colors.map(({ hex, usage, count }) => ({
                 hex: available(hex), usage: available(usage), count: available(count)
               })),
  fonts:       fontsFile.fonts.map(font => available(font)),
  primaryLogo: available(logosFile.primary_logo),
  logoRefs:    logosFile.logos.map(({ url, kind }) => ({
                 url: available(url), kind: available(kind)
               })),
  backdropRefs: logosFile.backdrops.map(({ url, kind }) => ({
                  url: available(url), kind: available(kind)
                })),
  cssTokens:   "./brand/tokens.css",
  reviewNotes: available(reviewNotes)
}

scenes = [
  {
    id: "title-intro",
    bindings: {
      identity: available(brand.name) or available(brand.domain),
      logo: brandContext.primaryLogo,
      colors: brandContext.colors,
      fonts: brandContext.fonts,
      cssTokens: brandContext.cssTokens
    },
    copy: <human-supplied title/intro copy>
  },
  {
    id: "product",
    bindings: {
      descriptionContext: brandContext.description,
      styleguide: brandContext.styleguide,
      colors: brandContext.colors,
      fonts: brandContext.fonts,
      logoRefs: brandContext.logoRefs,
      backdropRefs: brandContext.backdropRefs,
      reviewNotes: brandContext.reviewNotes
    },
    copy: <human-supplied product copy and approved claims>
  },
  {
    id: "cta-end-card",
    bindings: {
      identity: available(brand.name) or available(brand.domain),
      logo: brandContext.primaryLogo,
      colors: brandContext.colors,
      fonts: brandContext.fonts,
      cssTokens: brandContext.cssTokens
    },
    copy: <human-supplied CTA/end-card copy>
  }
]
```

Here `or` selects the first available identity value and otherwise produces
`unavailable`. Logo and backdrop URLs stay unchanged as references; the sketch
never downloads them. `reviewNotes` is passed for human review, not treated as
new brand data or product copy.

The human or creative agent supplies the product name, feature wording,
narration, claims, legal text, timing, and CTA copy. Only brand context is
derived from `./brand/`; this example invents no colors, fonts, copy claims, or
asset data.

## Deterministic scene mapping

Use [FRAME.md](FRAME.md) as the single storyboard/frame contract. Its three
scenes are:

| Scene | Brand bindings | Human-supplied content |
| --- | --- | --- |
| Title/intro | `brand.json` identity/context; available `tokens.css` color/font variables; optional `logos.json.primary_logo` reference | Title, subtitle/narration, duration, and transition intent |
| Product | available `colors.json`, `fonts.json`, `tokens.css`, `DESIGN.md` guidance, and optional logo/backdrop URL references | Product description, feature sequence, screenshots/video, narration, and claims |
| CTA/end-card | available `tokens.css`, `brand.json.domain`/`name`, and optional `primary_logo` reference | CTA wording, destination, legal text, and end-card timing |

If a signal is missing, null, empty, or unavailable, the scene contract marks
it `unavailable` and leaves the related visual or binding unset. It must not
substitute an invented value. The source package is references-only: this
workflow performs no logo download, binary download, rendering, or live video
integration.

## Limitations and boundary

This is a post-launch, non-blocking design handoff. It does not add a recipe,
mode, CLI flag, provider integration, renderer, asset pipeline, or tests. The
brand service may return partial or unavailable optional signals. Logos and
backdrops remain URL references only, and fonts remain names only; neither is
fetched or decoded by this documentation. A creative review must resolve copy,
claims, accessibility, timing, licensing, and final media decisions.
