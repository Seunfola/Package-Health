import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.html',
  styleUrl: './about-section.css',
})
export class AboutSection {
  steps = [
    {
      number: '01',
      title: 'Submit',
      description: 'A GitHub URL, a pasted package.json, or an uploaded manifest file — no source code ever leaves your browser.',
      icon: 'assets/icons/upload.svg',
    },
    {
      number: '02',
      title: 'Analyze',
      description: 'We cross-reference your dependency graph against live npm, PyPI, Cargo, and Go registry data.',
      icon: 'assets/icons/search.svg',
    },
    {
      number: '03',
      title: 'Score',
      description: 'Monte Carlo simulation, Shannon Entropy, AHP, and Poisson CDF turn that data into one defensible Trust Score — not just a raw CVE count.',
      icon: 'assets/icons/chart.svg',
    },
    {
      number: '04',
      title: 'Decide',
      description: 'The Gatekeeper policy engine applies your organization\'s thresholds — the shared default, or custom weights on PAID — to gate what ships.',
      icon: 'assets/icons/shield.svg',
    },
  ];
}
