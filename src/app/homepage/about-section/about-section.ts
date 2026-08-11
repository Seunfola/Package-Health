import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about-section.html',
  styleUrl: './about-section.css',
})
export class AboutSection {
  /** Matches the "How It Works" labels from the reference mockup, kept honest to what's real underneath each one. */
  steps = [
    {
      title: 'Scan',
      description: 'Scan your projects for all dependencies across npm, PyPI, Cargo, and Go.',
      icon: 'assets/icons/search.svg',
    },
    {
      title: 'Analyze',
      description: 'Analyze risk, license, and maintenance health deep within your dependency tree.',
      icon: 'assets/icons/gauge.svg',
    },
    {
      title: 'Re-scan',
      description: "Re-run a scan anytime to catch vulnerabilities disclosed since your last check — there's no background monitoring job today.",
      icon: 'assets/icons/refresh.svg',
    },
    {
      title: 'Secure',
      description: "The Gatekeeper policy engine enforces your org's thresholds before a risky dependency ships.",
      icon: 'assets/icons/shield.svg',
    },
  ];
}
