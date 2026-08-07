# DepVault — Comprehensive Design System & Product Specification

**Owner:** Cross-Functional Team (Design, Engineering, Product, QA, Marketing)
**Status:** Living Design Document & Figma Handoff Guide

## How this document was produced
This document is the synthesis of a cross-functional working session. Every decision was pressure-tested from specific seats at the table before shipping, ensuring this serves as a complete guide for both Figma design generation and engineering implementation.

### The Stakeholders
- **Product Designer & UI/UX Team** — Focus on user goals, high-grade premium aesthetics, visual trust, micro-interactions, and Figma token mapping.
- **Staff Engineer & Engineers (Front/Backend)** — Focus on blast radius, technical feasibility, state management, API data contracts, and component reusability.
- **Analytics** — Focus on data truthfulness, telemetry tracking, and ensuring designs reflect real metrics.
- **QA** — Focus on testability, edge cases, error states, and responsive/accessibility breakpoints.
- **Marketers and Promoters** — Focus on brand messaging, highlighting key differentiators (MCP Server, Gatekeeper), and conversion flows.

---

# Part I — The Board's Charter

Three core principles, debated and ratified to filter every design decision:

### 1. Serenity & Premium Aesthetics (Visual Restraint)
> **Product Designer & UI/UX:** We need a design that wows users but feels strictly professional and secure. We achieve this through a clean, light interface, highly curated color palettes (navy/slate/white), subtle glassmorphism only where it adds depth, and micro-animations on interaction.
> **Marketers:** It has to look like a premium, enterprise-grade product. 
> **Staff Engineer:** Agreed, but all aesthetic choices must live in the token layer. No one-off overrides. One card primitive, one button system.

**Ruling:** Use a unified token set. High-grade UI is achieved through precise typography, harmonious spacing, and semantic interaction feedback, not unnecessary ambient glow or "crazy futuristic" sci-fi tropes. It should feel like an elite, modern developer tool (e.g., Stripe, Vercel).

### 2. Deep Dive Experience (Read & Feel)
> **Marketers & Promoters:** The public pages cannot just be small "brochure" sites. Users need to "feel and read a lot" to understand our complex security value prop before deciding. We need rich visual storytelling, "out of the box" thinking imagery, and a simulated Command Prompt UI that shows our core CLI engine blocking toxic packages live.
> **Product Designer:** We will build a long-scroll, highly engaging landing page. We will use a mocked "Terminal UI" component to demonstrate exactly what DepVault does behind the scenes without needing the user to log in.

**Ruling:** The homepage and public pages must be expansive. Introduce the `TerminalMockup` component as a centerpiece visual, alongside rich reading sections that contrast traditional tools (like `npm audit`) with DepVault's predictive Gatekeeper.

### 3. Communicate Reality & Data Truthfulness (No Fabrication)
> **Staff Engineer:** I just audited the backend (`gatekeeper.interface.ts` and `repo-health.interface.ts`). We have massive capabilities that previous designs ignored. We *actually* calculate bundle size, license risks, ghost towns, commit activity, and even suggest safer alternative packages.
> **QA & Analytics:** If a user has no data, or a backend call fails, or they hit a wrong URL, what do they see? A blank page is unacceptable. We need "dead end" UI components.

**Ruling:** No silent failures, and no fabricated numbers. Every list must have a designed Empty State. Every failed API call must have a fallback Error State. The wildcard route must point to a designed 404 page. The Dashboard and Repo Details pages must be completely redesigned to showcase the real backend capabilities (Alternative Packages, License Risks, Ghost Town policies, and direct Dependency Graphs).

---

# Part II — Figma-Ready Design System (Tokens)

## 1. Color Palette

*These tokens map exactly to Figma Variables.*

| Token | Value | Figma Usage |
|---|---|---|
| `--bg-obsidian` / Page | `#FFFFFF` | Main page background |
| `--bg-slate` | `#F8FAFC` | Secondary surfaces (sidebars, secondary panels) |
| `--bg-surface` | `#FFFFFF` | Primary card surfaces |
| `--bg-navbar` | `#0B0F19` | Top navbar background (Dark contrast) |
| `--bg-terminal` | `#0F172A` | **NEW:** Deep slate for the new Command Prompt UI |
| `--accent-teal` (Primary) | `#2563EB` | Primary brand color (CTAs, active states) |
| `--accent-teal-hover` | `#1D4ED8` | Primary hover state |
| `--accent-emerald` (Sec)| `#22D3EE` | Secondary accent (active-nav underlines) |
| `--text-primary` | `#0F172A` | Headings, core body text |
| `--text-secondary` | `#475569` | Secondary body text |
| `--text-muted` | `#94A3B8` | Placeholders, captions, disabled states |
| `--text-on-dark` | `#F9FAFB` | Text on the dark navbar |
| `--text-terminal` | `#38BDF8` | **NEW:** Terminal text highlight color |
| `--glass-border` | `#E2E8F0` | Default component borders |

**Semantic Colors (QA/System States):**
- `--color-success`: `#22C55E` (Safe package, Passed checks, Terminal Success)
- `--color-warning`: `#F59E0B` (Vulnerable, warning)
- `--color-danger`: `#EF4444` (Critical risk, Blocked by Gatekeeper, Terminal Error)
- `--color-info`: `#3B82F6` (Neutral info)

## 2. Typography Scale (Inter & Fira Code)

> **UI/UX:** Modern typography is critical for the "premium" feel. We use Inter for clean, technical readability, and Fira Code/Monospace specifically for the Command Prompt UI to drive home the developer-centric focus.

- **Display (Hero):** 800 weight, `clamp(2.5rem, 5vw, 3.5rem)`
- **H1 (Page Title):** 700 weight, `2rem`
- **H2 (Section):** 600 weight, `1.5rem`
- **H3 (Card Title):** 600 weight, `1.25rem`
- **Body Large:** 400 weight, `1.15rem`
- **Body Base:** 400 weight, `1rem` (16px equivalent)
- **Body Small:** 400 weight, `0.875rem`
- **Terminal Text:** `font-family: 'Fira Code', monospace`, 400 weight, `0.9rem`

## 3. Spacing & Elevation (Flat Card System)

- **Spacing Scale:** `4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `120px` (for expansive public page section gaps).
- **Card Primitives (`.glass-card`):**
  - Surface: White
  - Border: `1px solid var(--glass-border)`
  - Radius: `12px` (Standard), `16px` (Large Panels)
  - Shadow: `0 1px 3px rgba(0,0,0,0.06)`
  - Hover Interaction: `translateY(-3px)`, enhanced shadow.

---

# Part III — Component Library & States

## 1. The Terminal Mockup Component (`TerminalMockup`)
> **Product Designer:** This is the "out of the box thinking" visual asset. Instead of just writing what we do, we show the CLI stopping a toxic package in its tracks.
- **Shell:** `--bg-terminal` background, macOS/Linux style window controls (red/yellow/green dots) in the top left, `border-radius: 12px`, subtle `--glow-teal` shadow.
- **Content:** Monospaced Fira Code text.
- **Animation:** Typewriter effect showing `depvault shield express@4.18.2` followed by a color-coded output block showing "BLOCKED: Predictive Risk High".

## 2. Empty States & Dead End UI (`EmptyStateCard`)
> **QA:** We need a unified component for when a page has no data, preventing the user from hitting a confusing blank screen.
- **Visual:** A subtle, grayscale icon in the center of the `.glass-card`.
- **Text:** A `--text-secondary` heading explaining why it's empty (e.g., "No repositories connected yet").
- **Action:** A primary CTA to resolve the state (e.g., `[Connect GitHub]`).

## 3. Real Backend-Driven Data Components (NEW)
> **Backend Engineer:** These components must be designed because the backend explicitly supports them.
- **Alternative Packages Table:** A component displaying Gatekeeper suggestions for safer packages when a block occurs.
- **Policy Toggles:** Switches specifically tailored for `block_critical_cves`, `block_ghost_towns`, `block_gpl_licenses`, and `warn_ecosystem_conflicts`.
- **Commit Activity Graph:** A D3/Chart.js component mapping to the backend's `commit_activity` week/day data array.
- **Trust Metrics Radar:** A radar chart or multi-progress bar showing `security`, `performance`, `reliability`, and `maintainability` independently.

## 4. Buttons
1. **Primary (`.btn-primary`):** Solid `--accent-teal` background, white text. Soft hover transition to `--accent-teal-hover`.
2. **Secondary (`.btn-secondary`):** Transparent background, `--glass-border`, text-primary. Fills to `--bg-slate` on hover.
3. **Ghost (`.btn-ghost`):** No border/bg, `--text-secondary`. Darkens on hover.
4. **Dark Surface Outline (`.btn-outline-dark`):** White border/text on `--bg-navbar`, exclusively for "Sign In" on public pages.

## 5. Status Badges (`StatusCard`)
- Used extensively for Trust Scores and Gatekeeper block verdicts.
- Pill shape, small text.
- Must use solid semantic color with white text, or light background (15% opacity) with semantic text color. No invert filters on icons.

## 6. Cards (`InsightCard` & `PackageHealthCard`)
- **`InsightCard`:** Icon + title + value + description + optional "View Details". Used when displaying core metrics.
- **`PackageHealthCard`:** Icon + title + description (no action button). Used in marketing grids.

## 7. Forms & Inputs
- **Default:** White background, `1px solid var(--glass-border)`, standard radius.
- **Focus:** Border changes to `--accent-teal`, subtle focus ring box-shadow (`--glow-teal`).
- **Error:** Border changes to `--color-danger`, error message below.

## 8. Navigation
- **`PublicNavbar`:** Used on marketing pages (Home, Docs, Pricing). Dark navy background (`--bg-navbar`), logo, flat top-level links (Features, Pricing, Docs). "Sign In" (outline) and "Get Started" (primary override to white) buttons. Mobile uses full-width dropdown.
- **`Navbar` (Dashboard):** Used inside the app. Search bar, avatar/org dropdown, light theme. 

---

# Part IV — Complete Page Specifications (Build Guide)

This section details every view in the application for Figma generation and UI implementation.

## 1. Public Marketing Pages (Expanded Scope)

### Home / Landing Page (`/home`)
> **Marketers & UI/UX:** The homepage must be a journey. It cannot be short. Users need to read, feel, and understand the deep security value.

- **Hero Section:** 
  - Eyebrow text: "npm · PyPI · Cargo · Go"
  - Interactive tabs for: GitHub URL input, Paste `package.json`, or Upload manifest file.
  - Placed directly on `--bg-obsidian` background. No boxing card. 
  - Has the *only* subtle background glow on the site (`.hero-glow-teal`, 30% opacity, placed tight to the hero content).
- **NEW: The Core Engine (Command Prompt UI):**
  - A massive, visually arresting `TerminalMockup` component sitting center stage right below the hero. 
  - Explains the CLI hook out-of-the-box experience. "Stop toxic packages before they hit your machine."
- **NEW: The 'Read & Feel' Problem Statement:**
  - Long-form, beautifully typeset reading section.
  - Side-by-side comparison: *Standard Vulnerability Scanners vs Predictive Risk Engine.*
  - Explains Structural Risk, Freshness/Abandonware, and Toxic Licenses in readable, engaging prose.
- **How It Works (About Section):** 
  - 4-column `.glass-card` tile grid: **Scan → Analyze → Re-scan → Secure**. 
- **Latest Insights (Features Section):** 
  - 2x2 grid using `PackageHealthCard`. 
  - Highlights: Advanced MCP Support, Ecosystem-Wide Coverage, Auto-Fix Suggestions, CI/CD & Git Hooks.
- **CTA Section:** 
  - Strong primary button pushing users back to the Hero analyzer (`id="analyze"`).

### Documentation (`/docs`)
> **Product Designer:** Needs to feel like a high-end developer tool (e.g., Stripe, Vercel).

- **Layout:** Sticky left sidebar (Category → Section links) + Main content column. 
- **Search:** Functional client-side filter input at the top of the sidebar.
- **Action Cards (Top of Content):** "Analyze a Repository" (routes to Hero) and "Set Up the MCP Server" (anchors to MCP section).
- **Sections:** Quick Start (Trust Score weighting), Ecosystems Supported, MCP Server Setup, Shield & Install Hooks, Organizations & Plans.
- **Tables:** Must scroll horizontally on narrow viewports.

### Pricing (`/pricing`)
> **Analytics/Staff Engineer:** Do not invent a 3rd tier. Render the 2 real tiers accurately.

- **Layout:** Two `.glass-card` tiers side-by-side.
- **FREE Tier:** 3 repos, 5 members, default read-only Gatekeeper policy. CTA opens Auth modal.
- **PAID Tier:** Unlimited repos/members, custom Gatekeeper scoring weights, notification webhooks. CTA opens `mailto:` to sales.
- **Comparison Table:** Six feature rows sourced from actual limits below the cards.

### 404 Page Not Found (`/404` or `**`)
> **UI/UX:** Currently, unknown routes instantly redirect to `/home`. This is confusing. We need a dedicated dead-end page.

- **Layout:** Centralized `.glass-card` containing a `404` header.
- **Content:** "We couldn't find that package... or that page."
- **Action:** A primary `.btn-primary` button to return to the Dashboard or Home.

---

## 2. Authenticated App Pages (Dashboard)

> **Backend Engineer:** The dashboard data relies heavily on API polling. UI must account for loading skeletons for all data panels.

### Global Dashboard Shell
- **Sidebar:** Left vertical navigation. Links to Dashboard, Repositories, Telemetry, Settings, Notifications. 
- **Top Bar (`Navbar`):** Global search, Avatar dropdown (Profile/Logout), Organization selector.

### Main Dashboard (`/dashboard`)
- **Overview Metrics:** Row of `InsightCards` showing total repos monitored, critical alerts, average trust score.
- **Recent Activity:** Feed of recent package scans and CI hook executions.
- **Gatekeeper Status:** Quick view of currently blocked packages.
- **Dead End UI / Empty State:** If no repos are scanned, display `EmptyStateCard` prompting the user to connect GitHub.

### Repository List & Health (`/repo-health`)
- **List View:** Table of connected repositories with overall Trust Score badge (`StatusCard`).
- **Repo Details:** 
  - **Top Metrics Row:** `Bundle Size`, `Popularity`, `Days Behind`, and `License Risks` (All real backend metrics).
  - **Overall Health Quadrant:** Visual display breaking down the score into `Security`, `Performance`, `Reliability`, and `Maintainability`.
  - **Commit Activity Graph:** Visualizing the backend's `commit_activity` timeline.
  - **Dependency Graph:** A direct visualization of the dependency tree, color-coded by health tier.
  - **Vulnerability List:** Sorted by severity (`CRITICAL`, `HIGH`, etc.). Shows `ghsa_id`, `vulnerable_version_range`, and `first_patched_version`.
  - **Alternative Packages:** If a dependency is toxic, display the Gatekeeper's `GatekeeperAlternative[]` suggestions.
  - **Remediation suggestions:** (Update to X version).
  - **Dead End UI / Empty State:** If the repo has 0 vulnerabilities, display a success `EmptyStateCard` indicating "Perfect Health".

### Package Scan Result (`/repo-health`)

> **UI/UX & Engineering:** A package scan should answer “can I use this?” before exposing the detailed scoring model. The browser view and a GitHub Actions comment must therefore share the same information hierarchy, even though the browser may be richer.

- **Scan digest (first result element):** A semantic pass / needs-attention state, package and version, one-sentence decision summary, Trust Score, and 95% confidence interval when returned by the API. Use the existing light surface plus semantic left border — never recreate GitHub’s dark comment styling in the product.
- **Severity distribution:** Five compact count tiles in this fixed order: Critical, High, Medium, Low, Unknown. Counts are always shown, including zero, so missing information is not confused with no risk.
- **Findings list:** Critical-to-low ordering; each row contains a severity badge, advisory identifier, short description, and affected range. No code snippets or vulnerable values belong in this view.
- **Actions:** Put the primary remediation action beside the findings heading; retain report, SBOM, and badge exports as secondary actions. Include “Copy CI summary” to provide a concise Markdown-ready report for PR comments and GitHub Actions logs.
- **No findings:** Render a green, explicit “No known vulnerabilities found” state; never leave the severity section blank.

### Telemetry (`/telemetry`)
- **Charts:** Trend charts showing Trust Score changes over the last 30 days. 
- **Note for Devs:** D3/Chart.js implementations must map to the CSS tokens (`--accent-teal`, `--bg-slate`) rather than hardcoded hex values.

### Organization Settings (`/dashboard-settings`)
- **Tabs:** General, Members, Gatekeeper Policies, Billing.
- **Gatekeeper Policies Tab (Real Features):** 
  - Toggle: Block Critical CVEs
  - Toggle: Block Ghost Towns (Abandonware)
  - Toggle: Block GPL / Toxic Licenses
  - Toggle: Warn on Ecosystem Conflicts
  - **Custom Scoring Weights (PAID only):** Sliders to adjust Security, License, Maintenance, and Popularity weightings.

### Notifications (`/notifications`)
- Simple list view of alerts (vulnerability discovered, repo scan failed). Unread state highlighted with `--bg-slate` background.
- **Dead End UI / Empty State:** "You're all caught up! No new alerts."

### User Profile (`/user-profile`)
- Manage personal details, connected GitHub accounts, and API keys.

---

## 3. Auth & Utility Flows

### Authentication Modal (`<app-auth-login>`)
- Unified modal for Sign Up / Sign In via OAuth (GitHub/Google).
- **Overlay:** Fixed full-viewport scrim `rgba(15,23,42,0.5)`. Click outside to close.
- Card centered in viewport.

### Invites & Transfers (`/accept-invite`, `/accept-transfer`)
- Flat, centered `.glass-card` on a light background.
- Success state checkmark uses `--color-success`.

### Unauthorized Access (`unauthorized-warning`)
- Near-opaque light scrim (`rgba(248,250,252,0.97)`) overlaying the restricted content.
- Flat `.glass-card` panel warning the user to log in.

### Legal Pages (`/privacy`, `/terms`)
- Standard text-heavy layout. Uses typography scale and `--bg-obsidian` background.

---

# Part V — Cross-Functional Checklists

## Engineering & Implementation Checklist
- [ ] Migrate any remaining hardcoded hex colors in `repo-health.css`, `dashboard.css`, and `settings.css` to tokens.
- [ ] Implement standardized spacing scale (`--space-1` to `--space-8`).
- [ ] Build the new `TerminalMockup` component.
- [ ] Build the new `EmptyStateCard` component.
- [ ] Add the missing `404 Not Found` route component instead of redirecting silently.
- [ ] Map the Repo Details UI exactly to the `RepositoryHealthData` interface.
- [ ] Map the Settings UI exactly to the `GatekeeperPolicyConfig` interface.
- [ ] Ensure all D3/Canvas charts consume CSS variables, not hardcoded colors.
- [ ] Implement Skeleton loaders for all Dashboard charts and lists.

## QA & Analytics Checklist
- [ ] Verify accessibility contrast (WCAG AA) across all text/background combinations.
- [ ] Ensure mobile navigation menu is fully interactive and accessible.
- [ ] Ensure long-scroll public pages render cleanly on mobile devices without overlapping elements.
- [ ] Verify error boundary states (e.g., rate limits, invalid package.json).
- [ ] Confirm telemetry fires correctly on all primary CTAs (Hero Analysis, Sign Up, View Docs).

## UI/UX & Figma Generation Notes
- **Figma Designers:** The design must feel like a modern, premium SaaS tool, **not** an AI-sloppy sci-fi concept. Stick strictly to the defined color palette (White/Navy/Teal). 
- **Build Variants:** For all buttons (Default/Hover/Focus/Disabled), Status Badges, Inputs, `TerminalMockup`, and the `EmptyStateCard`.
- Ensure you design the new **Alternative Packages Table**, **Policy Toggles**, and **Trust Metrics Radar** using the flat card system.
- **Do not introduce new colors** without approval from the Staff Engineer. Use the exact hex values provided in Part II.
