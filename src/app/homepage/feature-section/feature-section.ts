import { InsightCard } from '@/app/reusable/insight-card/insight-card';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [CommonModule, InsightCard],
  templateUrl: './feature-section.html',
  styleUrl: './feature-section.css',
})
export class FeatureSection {
  /**
   * Real, static facts about the product — not growth metrics. No public
   * stats endpoint exists yet, so anything framed as a live counter here
   * would have to be fabricated (the exact problem this replaced). These
   * are true today regardless of usage, and each links somewhere real.
   */
  insights = [
    {
      title: 'Ecosystems',
      value: '4',
      description: 'npm, PyPI, Cargo, and Go — one scoring engine, one Trust Score.',
      icon: 'assets/icons/package.svg',
      route: '/docs',
      fragment: 'ecosystems',
    },
    {
      title: 'Analysis',
      value: 'Zero-Trust',
      description: 'Only manifest metadata is analyzed — your source code is never uploaded or stored.',
      icon: 'assets/icons/shield.svg',
      route: '/docs',
      fragment: 'quick-start',
    },
    {
      title: 'AI Agents',
      value: 'Ready',
      description: 'A published MCP server lets Claude Code, Cursor, and Windsurf query Trust Scores directly.',
      icon: 'assets/icons/code.svg',
      route: '/docs',
      fragment: 'mcp-server',
    },
    {
      title: 'Plans',
      value: 'Free + Paid',
      description: 'Start free with real limits, no card required; upgrade for custom policies and branding.',
      icon: 'assets/icons/scale.svg',
      route: '/pricing',
    },
  ];

  constructor(private readonly router: Router) {}

  onInsightNavigate(insight: (typeof this.insights)[number]): void {
    void this.router.navigate([insight.route], insight.fragment ? { fragment: insight.fragment } : {});
  }
}
