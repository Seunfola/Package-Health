import { Component, input, output } from '@angular/core';

@Component({ selector: 'app-empty-state-card', standalone: true, templateUrl: './empty-state-card.html', styleUrl: './empty-state-card.css' })
export class EmptyStateCard {
  readonly title = input('Nothing to show yet');
  readonly message = input('When data is available, it will appear here.');
  readonly actionLabel = input<string>();
  readonly action = output<void>();
}
