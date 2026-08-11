import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Standalone deep-dive on the actual scan pipeline and math engine —
 * distinct from the homepage's four-card "How It Works" abstract and from
 * /features (which sells outcomes, not mechanics). Content mirrors what's
 * actually implemented in @depvault/core, not marketing paraphrase.
 */
@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './how-it-works.html',
  styleUrl: './how-it-works.css',
})
export class HowItWorksPage {
  readonly pipelineSteps = [
    {
      number: '01',
      title: 'Resolve the version',
      description:
        'A dist-tag like "latest" is rejected, not silently resolved — OSV can\'t range-match a tag, so querying it with one returns a wrong result set instead of failing loudly. Every scan resolves to one concrete version first.',
    },
    {
      number: '02',
      title: 'Detect ecosystem & manifest',
      description:
        'package.json, requirements.txt, pyproject.toml (PEP 621 or Poetry), Pipfile, Cargo.toml, or go.mod — parsed to the actual dependency list. npm, pnpm, yarn, and bun all resolve to the same npm ecosystem; only the lockfile and remediation command differ.',
    },
    {
      number: '03',
      title: 'Fetch signals, independently',
      description:
        "Registry metadata, OSV advisories, repository vitality, license, and download counts are fetched separately. A genuine 404 from a stats API means zero, honestly reported — any other failure is recorded in dataQuality and the result is marked degraded, never silently forfeited.",
    },
    {
      number: '04',
      title: 'Compute the Trust Score',
      description:
        'Security, license, maintenance, and popularity combine into one weighted score — the formula below. Monte Carlo simulation produces a 95% confidence interval instead of a single falsely-precise number.',
    },
    {
      number: '05',
      title: 'Apply policy & enforce',
      description:
        "The project's own threshold or risk policy decides pass/fail, then an org's Gatekeeper rules (block critical CVEs, GPL, ghost towns, ecosystem conflicts) can enforce further. Every surface — CLI, editor, CI, MCP — renders the same verdict; none re-derives it.",
    },
  ];

  readonly scoreBreakdown = [
    { label: 'Security', weight: 45, detail: 'Poisson CDF over known vulnerabilities, weighted by structural criticality (a leaf devDependency and a core runtime package are not equally risky).' },
    { label: 'License', weight: 20, detail: "A real recursive-descent SPDX parser — (MIT AND GPL-3.0) OR Apache-2.0 resolves via the clean branch, not a heuristic that sees \"AND\"/\"OR\" and assumes the worst case." },
    { label: 'Maintenance', weight: 20, detail: 'Repository vitality — commit frequency, release cadence, issue response — adjusted for structural weight so a quiet-but-stable core dependency isn\'t penalized like abandonware.' },
    { label: 'Popularity', weight: 15, detail: "Weekly downloads and dependent count, via each ecosystem's own registry — npm, PyPI, crates.io, and the Go module proxy." },
  ];

  readonly ecosystems = [
    { name: 'npm', manifests: 'package.json', managers: 'npm, pnpm, yarn, bun' },
    { name: 'PyPI', manifests: 'requirements.txt, pyproject.toml (PEP 621 / Poetry / PDM), Pipfile', managers: 'pip, pipenv, poetry, pdm' },
    { name: 'crates.io', manifests: 'Cargo.toml (including dotted [dependencies.foo] tables)', managers: 'cargo' },
    { name: 'Go', manifests: 'go.mod', managers: 'go' },
  ];

  readonly surfaces = [
    { name: 'CLI', detail: 'depvault scan, depvault leakguard scan, depvault shield — the published binary.' },
    { name: 'IDE (VS Code + LSP)', detail: 'Inline CodeLens, hover breakdowns, and diagnostics via an editor-agnostic language server; Neovim and Sublime Text have client configs too.' },
    { name: 'GitHub Action', detail: 'Shells out to the same CLI and renders its output — never a second copy of the pass/fail logic.' },
    { name: 'MCP server', detail: 'Gives AI coding agents a scan_package_health tool backed by the identical pipeline.' },
    { name: 'Dashboard', detail: "What you're looking at now — synced scans, org policy, and trend history over the same scored results." },
  ];
}
