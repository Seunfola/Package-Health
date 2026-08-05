import { PackageHealthCard } from '@/app/reusable/package-health-card/package-health-card';
import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';

@Component({
  selector: 'app-updates',
  imports: [CommonModule, PackageHealthCard],
  standalone: true,
  templateUrl: './updates.html',
  styleUrls: ['./updates.css'],
})
export class Updates {
  features = [
    {
      title: 'Multi-Ecosystem Coverage',
      description: 'One scan covers npm, PyPI, Cargo, and Go dependency graphs — the same mathematical pipeline for all four.',
      icon: 'assets/icons/package.svg',
    },
    {
      title: 'AI Agent Integration (MCP)',
      description: 'Ship the same risk engine into Claude Code, Cursor, and Windsurf via the published @deepvaultscan/mcp-server package.',
      icon: 'assets/icons/code.svg',
    },
    {
      title: 'Gatekeeper Policy Engine',
      description: 'Enforce org-wide merge and release gates — the shared default policy, or custom scoring weights on PAID.',
      icon: 'assets/icons/shield.svg',
    },
    {
      title: 'Predictive Math Engine',
      description: 'Monte Carlo simulation, Shannon Entropy, AHP, and Poisson CDF replace guesswork with an explainable score.',
      icon: 'assets/icons/gauge.svg',
    },
  ];

  smallFeatures = [
    {
      title: 'Zero-Trust Analysis',
      description: 'Only manifest metadata is analyzed — your source code is never uploaded or stored.',
    },
    {
      title: 'Built for Teams',
      description: 'Role-based access and org-wide policy inheritance keep every repository accountable to one standard.',
    },
  ];
}
