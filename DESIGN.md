# Inspire Lifestyle — Design System & Engineering Guide (`DESIGN.md`)

This file defines the official design tokens, component architecture, and interaction philosophy for **Inspire Lifestyle** (Storefront & Enterprise CRM). All AI agents and developers must adhere to these rules.

---

## 1. Brand Identity & Product Context

- **Brand:** Inspire Lifestyle
- **Positioning:** Atelier of Modern Luxury & Artisanal Fashion
- **Aesthetic World:** Monochromatic minimalism paired with rich tactile accents (Warm luxury, deep zinc tones, pristine white, subtle metallics, and verified contrast).

---

## 2. Curated UI & Vibecoding Resources

The following curated resources guide the interface patterns and visual craft for this codebase:

1. **[EvilCharts](http://evilcharts.com)** — Animated, fluid SVG charts for dashboards and metrics tracking.
2. **[Rewamp UI](http://rewampui.com)** — Clean, composable open-source components, blocks, and landing pages.
3. **[Refero](http://styles.refero.design)** — Real-world production product UI patterns, data tables, and CRM screens.
4. **[Bencho](http://bencho.dev)** — High-velocity AI product UI components for fast, reliable builds.
5. **[Inspora](http://inspora.design)** — Modern product UI inspiration and design language benchmarks.
6. **[Neuform](http://neuform.ai)** — Design-to-code resources for AI-assisted UI workflows.
7. **[Open Design](http://open-design.ai)** — Canonical `DESIGN.md` specification for AI agent pair-programming.
8. **[Easy UI](https://www.easyui.site/)** — 50+ modern design templates, copy-paste React/Tailwind component kits and landing page blocks.
9. **[Vibe Prompts](https://vibeprompts.dev/)** — Curated prompt engineering blueprints and modern UI component design patterns for precision AI vibecoding.
10. **[UIArc](https://uiarc.dev)** — Clean, polished, copy-paste React & Tailwind UI components for sleek web applications.
11. **[Modern UI Craft (masudranaxpert)](https://github.com/masudranaxpert/modern-ui-craft)** — 2026-grade curated modern UI references + skill: telemetry dashboards, conversion funnel anatomy, measured color systems, soft-shell floating cards, and Emil Kowalski motion discipline.

---

## 3. Color Token System (`better-colors` & `impeccable colorize`)

### Neutral Ramp (Zinc)
- **Canvas / Background:** `#FFFFFF` in Light Mode, `#09090b` (`zinc-950`) in Dark Mode
- **Elevated Surfaces / Cards:** `#FAFAFA` / `#F4F4F5` (`zinc-50` / `zinc-100`) in Light Mode, `#121215` / `#18181b` (`zinc-900`) in Dark Mode
- **Structural Borders:** `border-zinc-200/80` in Light Mode, `border-zinc-800/80` in Dark Mode
- **Body & Headline Ink:** `text-zinc-950` in Light Mode, `text-zinc-50` in Dark Mode
- **Muted Labels:** `text-zinc-500` / `text-zinc-400`

### Semantic Status Colors
- **Success / Delivered / Paid / Growth:** Emerald (`#10B981`)
  - Badge: `bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/60`
- **In Progress / Shipped:** Indigo (`#6366F1`)
  - Badge: `bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/60`
- **Pending / Attention / Low Stock:** Amber (`#F59E0B`)
  - Badge: `bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-800/60`
- **Destructive / Cancelled:** Rose (`#EF4444`)
  - Badge: `bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60`
- **VIP Patron Tier:** Royal Purple (`#8B5CF6`) and Atelier Warm Gold (`#D97706`)

---

## 4. Typography Rules (`better-typography`)

- **Font Family:** `font-sans` with macOS antialiasing (`-webkit-font-smoothing: antialiased`).
- **Tabular Numerics:** All currency (`৳`), order IDs, phone numbers, quantities, and dates MUST use `font-mono tabular-nums` to eliminate layout shift.
- **Headings:**
  - Page Titles: `text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50`
  - Section Headings: `text-sm font-semibold tracking-normal text-zinc-900 dark:text-zinc-100`
  - Wrap Policy: `text-wrap: balance` on headlines, `text-wrap: pretty` on paragraph descriptions.
- **Micro-Copy:** Verb-first action buttons (`Add product`, `Create order`, `Publish slide`, `Save changes`). Sentence case across all UI components.

---

## 5. Interaction & Motion Rules (`emil-design-eng` & `apple-design`)

- **Tactile Feedback:** Pressable controls and table action rows must feature subtle scale on press:
  ```css
  active:scale-[0.97] transition-transform duration-150 ease-out
  ```
- **Concentric Radii:** Outer element radius = inner element radius + padding (e.g. Card `rounded-xl` with inner badge `rounded-lg`).
- **Surface Elevation:** Prefer layered transparent shadows (`shadow-2xs`, `shadow-xs`) for depth, and 1px crisp borders for structure.
- **Duration Ceiling:** UI feedback transitions must complete within `100ms–200ms`. Never use `transition: all`; explicitly declare properties (`transition-colors`, `transition-transform`, `transition-opacity`).
- **Origin-Aware Entrances:** Dialogs and sheets animate from `scale(0.95)` with `opacity: 0` to `scale(1)` with `opacity: 1`. Never animate from `scale(0)`.

---

## 6. Component Guidelines (`use-ui-libraries`)

- **Icons:** Standardized on `lucide-react` across all surfaces (16px standard, 20px header actions, 1.5px/2px stroke).
- **Navigation:** Grouped by operational domains (Management, Storefront CMS, Insights, Live Store link).
- **Forms & Modals:** Direct inline validation, sensible defaults, accessible Escape key listeners, and backdrop blur scrims (`backdrop-blur-xs`).

---

## 7. Full-Page Navigation Architecture (No Modals for Core CRUD)

- **Product CRUD:** Dedicated main page (`/admin/products`), dedicated creation workspace (`/admin/products/new`), and dedicated editor with live preview (`/admin/products/[id]`).
- **Customer CRUD:** Dedicated patron directory (`/admin/customers`), dedicated patron registration (`/admin/customers/new`), and 360° patron profile & history (`/admin/customers/[id]`).
- **Order CRUD:** Dedicated orders ledger (`/admin/orders`), dedicated showroom order creation (`/admin/orders/new`), and printable luxury tax invoice (`/admin/orders/[id]`).
- **Telemetry & Analytics:** Dedicated high-fidelity dashboard (`/admin/analytics`) adhering to Modern UI Craft and EvilCharts dual-layer SVG charts and funnel telemetry.
