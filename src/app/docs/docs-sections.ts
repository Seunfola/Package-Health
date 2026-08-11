/**
 * Single source of truth for doc topics — drives the sidebar, the command
 * palette, and prev/next navigation. Order here is the reading order for
 * prev/next; category groups the sidebar. Adding a topic means adding one
 * entry here plus its route in app.routes.ts — nothing else needs to know
 * the full list.
 */
export interface DocSection {
  id: string;
  title: string;
  category: string;
  /** One line shown under the title in the command palette. */
  description: string;
  /** Lowercase keywords the command palette and sidebar search match on. */
  keywords: string;
}

export const DOC_SECTIONS: DocSection[] = [
  {
    id: 'quick-start',
    title: 'Quick Start',
    category: 'Getting Started',
    description: 'Submit a repo or manifest and read your first Trust Score.',
    keywords: 'quick start submit github url manifest package.json trust score security license maintenance popularity weight',
  },
  {
    id: 'analyzer',
    title: 'Dashboard & Analyzer',
    category: 'Getting Started',
    description: 'The browser surfaces — project analyzer, Package Health, private repos.',
    keywords: 'dashboard analyzer repository github url manifest package health trust score report sbom badge history private repo repository github app installation connect installationid personal access token',
  },
  {
    id: 'ecosystems',
    title: 'Ecosystems & Scoring',
    category: 'Getting Started',
    description: 'npm, PyPI, Cargo, and Go — one engine, one pipeline.',
    keywords: 'ecosystems npm pypi cargo go package json requirements pyproject cargo toml go mod poisson monte carlo entropy license',
  },
  {
    id: 'analysis-method',
    title: 'Analysis, Accuracy & Math',
    category: 'Getting Started',
    description: 'The actual formula, confidence intervals, and its real limits.',
    keywords: 'analysis accuracy methodology formula mathematics poisson cvss monte carlo confidence interval entropy freshness diversity threshold limitations',
  },
  {
    id: 'downloads',
    title: 'Downloads & Install Links',
    category: 'Automation',
    description: 'Real, current publish status for every surface — nothing fabricated.',
    keywords: 'download install npm npx package cli vscode extension marketplace jetbrains lsp4ij github release build from source',
  },
  {
    id: 'cli',
    title: 'CLI & Shield',
    category: 'CLI Usage',
    description: 'Pre-scan installs, gate hooks, and offline verdict caching.',
    keywords: 'cli install build scan shield audit status init hooks install gate block force sync offline verdict cache upload login sbom',
  },
  {
    id: 'leakguard',
    title: 'LeakGuard — Secret Detection',
    category: 'CLI Usage',
    description: 'Redacted-by-default secret scanning, remediation, and CI.',
    keywords: 'leakguard secret detection api key token credential leak scan staged diff verify live blast radius playbook rotation script pre-commit pre-push hook allowlist severity liveness sarif dashboard sync upload',
  },
  {
    id: 'github-actions',
    title: 'GitHub Actions',
    category: 'Automation',
    description: 'Gate a pull request on Trust Score with a composite Action.',
    keywords: 'github actions ci cd pull request job summary comment action yaml fail below output threshold',
  },
  {
    id: 'ci-cd',
    title: 'CI/CD Beyond GitHub',
    category: 'Automation',
    description: 'GitLab, Bitbucket, and Jenkins templates for LeakGuard.',
    keywords: 'ci cd gitlab bitbucket pipelines jenkins jenkinsfile exit code contract fail on sarif leakguard template',
  },
  {
    id: 'mcp-server',
    title: 'MCP for AI Agents',
    category: 'Developer Tools',
    description: 'Give Claude Code, Cursor, or Windsurf a live Trust Score tool.',
    keywords: 'mcp server claude code cursor windsurf model context protocol npx scan package health repository auto scan',
  },
  {
    id: 'ide-lsp',
    title: 'IDE Extension & LSP',
    category: 'Developer Tools',
    description: 'VS Code, Neovim, Sublime, JetBrains — plus dashboard sign-in.',
    keywords: 'vscode visual studio code lsp language server neovim sublime jetbrains hover diagnostics codelens quick fix sign in personal access token dashboard sync',
  },
  {
    id: 'organizations',
    title: 'Organizations & Settings',
    category: 'Organizations',
    description: 'Members, Gatekeeper policy, webhooks, and notifications.',
    keywords: 'organizations free paid members settings gatekeeper policies webhooks api token private repository upload notifications search bulk delete unread mark read cleanup',
  },
  {
    id: 'privacy',
    title: 'Data, Privacy & Limits',
    category: 'Reference',
    description: 'What DepVault sends, stores, and never touches.',
    keywords: 'privacy telemetry network offline cache source code data github token limitations security',
  },
];

export function docSectionsByCategory(): { category: string; sections: DocSection[] }[] {
  const categories = [...new Set(DOC_SECTIONS.map((s) => s.category))];
  return categories.map((category) => ({
    category,
    sections: DOC_SECTIONS.filter((s) => s.category === category),
  }));
}

export function docSectionIndex(id: string): number {
  return DOC_SECTIONS.findIndex((s) => s.id === id);
}
