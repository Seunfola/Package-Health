import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface DocSection {
  id: string;
  title: string;
  category: string;
  /** Lowercase keywords this section matches on in the search box below. */
  keywords: string;
}

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './docs.html',
  styleUrl: './docs.css',
})
export class DocsPage {
  searchTerm = '';
  readonly currentYear = new Date().getFullYear();

  /**
   * Real sections that actually exist below — not the placeholder categories
   * from the reference mockup (no "API Reference / Endpoints, Models" page
   * exists, so it's not listed as if it did).
   */
  readonly sections: DocSection[] = [
    {
      id: 'quick-start',
      title: 'Quick Start',
      category: 'Getting Started',
      keywords: 'quick start submit github url manifest package.json trust score security license maintenance popularity weight',
    },
    {
      id: 'analyzer',
      title: 'Dashboard & Analyzer',
      category: 'Getting Started',
      keywords: 'dashboard analyzer repository github url manifest package health trust score report sbom badge history private repo repository github app installation connect installationid personal access token',
    },
    {
      id: 'ecosystems',
      title: 'Ecosystems & Scoring',
      category: 'Getting Started',
      keywords: 'ecosystems npm pypi cargo go package json requirements pyproject cargo toml go mod poisson monte carlo entropy license',
    },
    {
      id: 'analysis-method',
      title: 'Analysis, Accuracy & Math',
      category: 'Getting Started',
      keywords: 'analysis accuracy methodology formula mathematics poisson cvss monte carlo confidence interval entropy freshness diversity threshold limitations',
    },
    {
      id: 'cli',
      title: 'CLI & Shield',
      category: 'CLI Usage',
      keywords: 'cli install build scan shield audit status init hooks install gate block force sync offline verdict cache upload login sbom',
    },
    {
      id: 'leakguard',
      title: 'LeakGuard — Secret Detection',
      category: 'CLI Usage',
      keywords: 'leakguard secret detection api key token credential leak scan staged diff verify live blast radius playbook rotation script pre-commit pre-push hook allowlist severity liveness sarif dashboard sync upload',
    },
    {
      id: 'github-actions',
      title: 'GitHub Actions',
      category: 'Automation',
      keywords: 'github actions ci cd pull request job summary comment action yaml fail below output threshold gatekeeper',
    },
    {
      id: 'ci-cd',
      title: 'CI/CD Beyond GitHub',
      category: 'Automation',
      keywords: 'ci cd gitlab bitbucket pipelines jenkins jenkinsfile exit code contract fail on sarif leakguard template',
    },
    {
      id: 'downloads',
      title: 'Downloads & Install Links',
      category: 'Automation',
      keywords: 'download install npm npx package cli vscode extension marketplace jetbrains lsp4ij github release build from source',
    },
    {
      id: 'mcp-server',
      title: 'MCP for AI Agents',
      category: 'Developer Tools',
      keywords: 'mcp server claude code cursor windsurf model context protocol npx scan package health repository auto scan',
    },
    {
      id: 'ide-lsp',
      title: 'IDE Extension & LSP',
      category: 'Developer Tools',
      keywords: 'vscode visual studio code lsp language server neovim sublime jetbrains hover diagnostics codelens quick fix',
    },
    {
      id: 'organizations',
      title: 'Organizations & Settings',
      category: 'Organizations',
      keywords: 'organizations free paid members settings gatekeeper policies webhooks api token private repository upload notifications search bulk delete unread mark read cleanup',
    },
    {
      id: 'privacy',
      title: 'Data, Privacy & Limits',
      category: 'Reference',
      keywords: 'privacy telemetry network offline cache source code data github token limitations security',
    },
  ];

  get categories(): string[] {
    return [...new Set(this.sections.map((s) => s.category))];
  }

  sectionsIn(category: string): DocSection[] {
    return this.sections.filter((s) => s.category === category);
  }

  isVisible(id: string): boolean {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return true;
    const section = this.sections.find((s) => s.id === id);
    return !!section && (section.title.toLowerCase().includes(term) || section.keywords.includes(term));
  }

  get noResults(): boolean {
    return this.searchTerm.trim().length > 0 && !this.sections.some((s) => this.isVisible(s.id));
  }
}
