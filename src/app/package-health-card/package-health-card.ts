import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-package-health-card',
  imports: [],
  standalone: true,
  templateUrl: './package-health-card.html',
  styleUrl: './package-health-card.css',
})
export class PackageHealthCard {
  @Input({ required: true }) feature!: { title: string; description: string; icon: string };
}
