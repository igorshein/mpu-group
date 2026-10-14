---
name: Industrial Precision Grid
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#5d3f3c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#926f6b'
  outline-variant: '#e7bdb8'
  surface-tint: '#c00014'
  primary: '#ba0013'
  on-primary: '#ffffff'
  primary-container: '#e31e24'
  on-primary-container: '#fffafa'
  inverse-primary: '#ffb4ab'
  secondary: '#5d5e63'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e8'
  on-secondary-container: '#636469'
  tertiary: '#595b64'
  on-tertiary: '#ffffff'
  tertiary-container: '#71747d'
  on-tertiary-container: '#fdfbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000d'
  secondary-fixed: '#e2e2e8'
  secondary-fixed-dim: '#c6c6cb'
  on-secondary-fixed: '#1a1c20'
  on-secondary-fixed-variant: '#45474b'
  tertiary-fixed: '#e0e2ed'
  tertiary-fixed-dim: '#c4c6d1'
  on-tertiary-fixed: '#181b23'
  on-tertiary-fixed-variant: '#44474f'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-hero:
    fontFamily: Montserrat
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-hero-mobile:
    fontFamily: Montserrat
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Montserrat
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-xl-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: 0.02em
  headline-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: 0.01em
  headline-sm:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-tabular:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system serves enterprise industrial procurement, supply chain logistics, and heavy industrial distribution across regional and federal scales. The personality is uncompromising, disciplined, authoritative, and structurally efficient. It communicates speed, absolute fulfillment accuracy, and operational scale.

The visual direction marries high-contrast modern brutalism with corporate precision. It draws direct architectural inspiration from shipping containers, heavy machinery silhouettes, structural steel frameworks, and dynamic angular geometries. UI surfaces emphasize distinct contrast blocks (deep carbon black against vivid warning-accent crimson and crisp light neutrals), crisp planar cuts, and high-density information displays. Rounded elements and decorative fluff are avoided in favor of architectural utility, stark planar contrasts, and clear data typography.

## Colors

The palette establishes an immediate industrial cadence using high-visibility functional hues:

- **Primary Red (`#E31E24`)**: High-visibility industrial signal red. Used for critical interactive triggers, quotation prompts, active tracking nodes, urgent statuses, and dynamic brand accents.
- **Secondary Carbon Graphite (`#191B1F` & `#111215`)**: Deep, unyielding industrial dark tones. Used for navigational monolithic bars, footer slabs, high-contrast dark sections, hero backgrounds, and heavy contrast banners.
- **Dark Slate Accent (`#252830`)**: Mid-tier structural dark tone. Used for secondary cards in dark mode surfaces, input borders on dark themes, and subtle container separating panels.
- **Clean Neutral Canvas (`#FFFFFF` & `#F8F9FA`)**: Crisp, glare-free operational backgrounds ensuring long-session legibility for procurement matrices, specifications, and shipment manifests.
- **Subtle Industrial Grays (`#EBEFF2` & `#DCE2E6`)**: Structural borders, table outlines, data division rules, and disabled surface fills.
- **Typography Tones**: Primary text sits at `#111215` for maximum contrast, muted metadata sits at `#6B7280`, and inverted text on dark components utilizes `#FFFFFF`.

## Typography

The type system balances commanding structural authority with clean analytical legibility:

- **Headlines (Montserrat)**: Geometric, unapologetic, and dense. Main category titles and section markers should use uppercase styling with tight kerning (`label-caps`) to echo industrial signage, serial stamps, and architectural wayfinding.
- **Body & Tabular Data (Manrope)**: High legibility, neutral x-height, and precise numeric glyphs. Ideal for extensive SKU inventories, technical datasheets, quotation metrics, and multi-tier procurement specs.
- Numerical fields and pricing tables must always render with proportional tabular numbers (`font-variant-numeric: tabular-nums`) to ensure strict alignment across data matrices.

## Layout & Spacing

The layout is built upon an architectural 12-column grid system with stark geometric boundaries and modular block framing:

- **Grid Architecture**: 12 columns on desktop (`margin: 3rem`, `gutter: 1.5rem`), transitioning to 6 columns on tablet and 4 columns on mobile screens (`margin: 1rem`, `gutter: 1rem`).
- **Angular Cuts & Block Transitions**: Hero sections, promotional banners, and visual anchors feature dynamic 45-degree corner chamfers or diagonal boundary lines (`clip-path: polygon(...)`), drawing from the angular visual tension seen in the logo and modern industrial layouts.
- **Dense Grid Blocks**: Catalog segments, KPI scorecards, and warehouse statuses use zero-gap or sub-pixel border abutting grids (`1px solid #DCE2E6`) rather than floating cards, enforcing an engineered, monolithic structure.

## Elevation & Depth

This system intentionally departs from soft, floaty shadows in favor of crisp structural boundaries and tonal surface layering:

- **Flat Solid Boundaries**: Surfaces are distinguished via direct tonal juxtaposition: pure white (`#FFFFFF`) against clean cool gray (`#F8F9FA`), framed by hard borders (`#DCE2E6` or `#191B1F`).
- **Hard Technical Drop Shadows**: Where depth is required (such as sticky RFQ quote panels, active search dropdowns, and modal dialogs), use non-diffused, sharp offsets: `4px 4px 0px 0px #191B1F` or a subtle dark inset outline. Avoid blurry, soft Gaussian blurs.
- **Dynamic Inverted Dark Layers**: High-priority utility modules (quick request bars, live logistics trackers, hero consultation units) utilize solid `#191B1F` or `#111215` containers directly recessed into white or red accent grounds.

## Shapes

The shape language is strictly **Sharp (Level 0)**:

- Every interactive button, input element, card, tab, badge, and modal utilizes an exact `0px` border radius (`roundedness: 0`).
- To echo the geometric chevron and diagonal cut from the logo's central graphic mark, special callouts, hero CTA buttons, and status indicator tags may incorporate a 6px to 12px diagonal chamfer cut on the top-right or bottom-left corner.
- Structural borders are uniformly `1px` or `2px` solid rules without soft gradients or rounded corner caps.

## Components

### Buttons
- **Primary Industrial Button**: Solid `#E31E24` fill, `#FFFFFF` uppercase Montserrat bold text, 0px border radius, 14px horizontal padding, 12px vertical padding. On hover: shifts to `#191B1F` with instant 100ms cubic-bezier transition. Optional diagonal 8px cut on the top-right corner.
- **Secondary Technical Button**: Transparent fill, 2px solid `#191B1F` border, `#191B1F` text. On hover: fills `#191B1F` with `#FFFFFF` text.
- **Ghost / Table Action**: Minimal borderless button with bold text and an adjacent red directional arrow (`→`) indicator.

### Input Fields & RFQ Quick Form
- **Form Surface**: 1px solid `#DCE2E6` border on `#FFFFFF` ground. Sharp corners.
- **Active / Focus State**: 2px solid `#E31E24` outline, zero offset shadow.
- **Hero Direct-Quote Block**: Deep graphite panel (`#191B1F`) housing stacked high-density input fields, clear labels in uppercase `label-caps` (`#6B7280`), and an urgent full-width red submission trigger.

### Catalog Matrices & Cards
- **Product & Category Cards**: Flat white containers enclosed in a `1px solid #DCE2E6` frame. Images sit on an off-white `#F8F9FA` background with technical specifications presented in a clean 2-column key-value matrix.
- **Hover Behavior**: The bottom border or top accent line animates to `#E31E24` (2px height), accompanied by a subtle 2px upward shift without blur shadows.

### Chips & Status Badges
- **Specification Chips**: Square-cornered badges with `#EBEFF2` fill and `#111215` text.
- **Operational Status Indicators**: Sharp badges with solid `#E31E24` (Urgent/Available), `#191B1F` (In Transit), or `#252830` (Warehouse Ready) paired with crisp white monospaced uppercase typography.

### Checkboxes & Radio Elements
- **Selection Nodes**: Strict square checkboxes (18px × 18px), 1.5px solid `#191B1F` border. Checked state renders a solid `#E31E24` fill with an inset sharp white geometric checkmark.

### Warehouse & Logistics Statistics Counters
- High-impact data modules featuring oversized numbers (`headline-xl` in `#E31E24` or `#191B1F`) stacked above uppercase, tracking-spaced descriptive labels (`label-caps` in `#6B7280`), separated by vertical 1px hairline rules.