# Video product launch frame contract

This is one deterministic storyboard/frame contract template for a
documentation/design handoff. It is not a second recipe, CLI mode, renderer,
or media manifest. Replace only the angle-bracket placeholders with human- or
creative-agent supplied product copy and production decisions. Brand values
come only from the six files in `./brand/`.

## Inputs and bindings

| Binding | Source | Rule |
| --- | --- | --- |
| `brand.domain` | `brand.json.domain` | Use when present; otherwise `unavailable`. |
| `brand.name` | `brand.json.name` | Use when present; otherwise `unavailable`. |
| `brand.description` | `brand.json.description` | Context only; never treat it as approved product copy. |
| `brand.styleguide` | `brand.json.styleguide` and `DESIGN.md` | Use only the available styleguide fields. |
| `brand.colors` | `colors.json.colors[]` | Preserve each available `hex`, `usage`, and `count`; no fallback color. |
| `brand.fonts` | `fonts.json.fonts[]` | Preserve available font names; no fallback font. |
| `brand.logo` | `logos.json.primary_logo` | URL reference only; no download or binary embedding. |
| `brand.logoRefs` | `logos.json.logos[]` | Preserve available `url` and `kind` only. |
| `brand.backdropRefs` | `logos.json.backdrops[]` | Preserve available `url` and `kind` only. |
| `brand.cssTokens` | `tokens.css` | Consume available generated `--brand-color-N` and `--brand-font-N` variables only. |
| `brand.notes` | `DESIGN.md` | Review summary, provenance, and limitations; not additional data. |

## Frame record template

```yaml
contract: video-product-launch-frame-v1
source_artifacts:
  directory: ./brand/
  files: [brand.json, colors.json, fonts.json, logos.json, tokens.css, DESIGN.md]
  domain: <brand.domain from brand.json, or unavailable>
global:
  copy_owner: human-or-creative-agent
  copy_status: <placeholder: draft|approved>
  render_status: no-render
  download_status: no-download
scenes:
  - id: title-intro
    purpose: title/intro
    duration: <human-supplied duration>
    bindings:
      identity: <brand.name or brand.domain, or unavailable>
      logo: <brand.logo or unavailable>
      colors: <brand.colors or unavailable>
      fonts: <brand.fonts or unavailable>
      css_tokens: <brand.cssTokens or unavailable>
    copy:
      title: <human-supplied title>
      subtitle: <human-supplied subtitle or unavailable>
      narration: <human-supplied narration or unavailable>
  - id: product
    purpose: product
    duration: <human-supplied duration>
    bindings:
      description_context: <brand.description or unavailable>
      styleguide: <brand.styleguide or unavailable>
      colors: <brand.colors or unavailable>
      fonts: <brand.fonts or unavailable>
      logo_refs: <brand.logoRefs or unavailable>
      backdrop_refs: <brand.backdropRefs or unavailable>
      design_notes: <brand.notes>
    copy:
      product_name: <human-supplied product name>
      feature_beats: <human-supplied feature descriptions>
      narration: <human-supplied narration or unavailable>
      claims: <human-supplied approved claims or unavailable>
  - id: cta-end-card
    purpose: CTA/end-card
    duration: <human-supplied duration>
    bindings:
      identity: <brand.name or brand.domain, or unavailable>
      logo: <brand.logo or unavailable>
      colors: <brand.colors or unavailable>
      fonts: <brand.fonts or unavailable>
      css_tokens: <brand.cssTokens or unavailable>
    copy:
      cta: <human-supplied CTA>
      destination: <human-supplied destination or unavailable>
      legal_text: <human-supplied legal text or unavailable>
```

## Missing-data behavior

Each binding is deterministic: use the referenced value when it exists in the
named artifact; otherwise record `unavailable` and omit the dependent visual
or styling decision. Empty arrays remain empty. Do not infer a color from a
logo URL, invent a font, turn `description` into a claim, or replace an
unavailable logo with a made-up mark. A human must resolve any required
missing signal before production.

## No-render/no-download boundary

This contract describes inputs, bindings, and copy ownership only. It does not
render frames, fetch or download logo/backdrop URLs, decode binaries, create
video files, call a provider, or implement HTML/CSS/Remotion code. The only
derived material is brand context already present in the six generated files;
product copy and production decisions remain explicit human inputs.
