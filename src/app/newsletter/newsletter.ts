import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewsletterService } from '@/app/services/newsletter.service';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.css',
})
export class NewsletterPage {
  email = '';
  state: SubmitState = 'idle';
  errorMessage = '';

  readonly highlights = [
    'New supply-chain attack patterns as they emerge, explained in plain language',
    'Product updates — new ecosystems, scanner rules, and IDE/CI integrations',
    'One email at most every two weeks — no growth-hacking drip campaigns',
  ];

  constructor(private readonly newsletterService: NewsletterService) {}

  subscribe(form: NgForm): void {
    if (!form.valid || this.state === 'loading') return;

    this.state = 'loading';
    this.errorMessage = '';

    this.newsletterService.subscribe(this.email.trim()).subscribe({
      next: () => {
        this.state = 'success';
      },
      error: (err) => {
        this.state = 'error';
        this.errorMessage = err?.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }
}
