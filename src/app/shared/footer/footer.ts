import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

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

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  currentYear: number = new Date().getFullYear();

  /** Every link here must be real — no placeholders, no unbuilt pages. */
  footerLinks: FooterColumn[] = [
    {
      title: 'Product',
      links: [
        { label: 'Features', routerLink: '/features' },
        { label: 'Pricing', routerLink: '/pricing' },
        { label: 'Docs', routerLink: '/docs' },
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
}
