import { PackageHealthCard } from '@/app/reusable/package-health-card/package-health-card';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-feature-section',
  standalone: true,
  imports: [CommonModule, PackageHealthCard],
  templateUrl: './feature-section.html',
  styleUrl: './feature-section.css',
})
export class FeatureSection {
  /**
   * Matches the reference mockup's "Latest Insights" 4-card section. Titles
   * follow the mockup closely; descriptions stay honest to what's actually
   * shipped — "Automated Remediation" in the mockup became "Auto-Fix
   * Suggestions" here since the real engine suggests fix strategies, it
   * doesn't autonomously patch and merge code.
   */
  insights = [
    {
      title: 'Advanced MCP Support',
      description: 'Seamless integration with the Model Context Protocol lets AI coding agents check Trust Scores directly.',
      icon: 'assets/icons/code.svg',
    },
    {
      title: 'Ecosystem-Wide Coverage',
      description: 'One scan, one mathematical pipeline, across npm, PyPI, Cargo, and Go.',
      icon: 'assets/icons/package.svg',
    },
    {
      title: 'Auto-Fix Suggestions',
      description: 'The core engine suggests autonomous fix strategies for resolving vulnerable dependency graphs.',
      icon: 'assets/icons/gitfork.svg',
    },
    {
      title: 'CI/CD & Git Hooks',
      description: 'Run depvault scan in any CI pipeline, or gate commits locally with a pre-commit hook.',
      icon: 'assets/icons/gitpull.svg',
    },
  ];
}
