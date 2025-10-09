import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-insight-card',
  imports: [],
  templateUrl: './insight-card.html',
  styleUrl: './insight-card.css',
})
export class InsightCard {
  @Input() insight!: {
    title: string;
    description: string;
    icon: string;
    value: string | number;
  };

  @Output() viewDetails = new EventEmitter<string>();

  onViewDetails() {
    this.viewDetails.emit(this.insight.title);
  }
}
