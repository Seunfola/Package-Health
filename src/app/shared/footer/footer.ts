import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { NewsletterService } from '@/app/services/newsletter.service';

interface FooterLink {
  label: string;
  routerLink?: string;
  fragment?: string;
  href?: string;
  external?: boolean;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

type SubscribeState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, FormsModule],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear: number = new Date().getFullYear();

  email = '';
  subscribeState: SubscribeState = 'idle';
  subscribeError = '';

  /** Every link here must be real — no placeholders, no unbuilt pages. */
  footerLinks: FooterColumn[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', routerLink: '/features' },
        { label: 'Pricing', routerLink: '/pricing' },
        { label: 'Docs', routerLink: '/docs' },
        { label: 'How It Works', routerLink: '/how-it-works' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'GitHub (Web App)', href: 'https://github.com/Seunfola/Package-Health', external: true },
        { label: 'GitHub (Backend)', href: 'https://github.com/Seunfola/package-health-backup', external: true },
        {
          label: 'MCP Server (npm)',
          href: 'https://www.npmjs.com/package/@deepvaultscan/mcp-server',
          external: true,
        },
      ],
    },
  ];

  constructor(private readonly newsletterService: NewsletterService) {}

  subscribe(form: NgForm): void {
    if (!form.valid || this.subscribeState === 'loading') return;

    this.subscribeState = 'loading';
    this.subscribeError = '';

    this.newsletterService.subscribe(this.email.trim()).subscribe({
      next: () => {
        this.subscribeState = 'success';
        this.email = '';
      },
      error: (err) => {
        this.subscribeState = 'error';
        this.subscribeError = err?.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }
}
