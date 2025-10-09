import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-insight-card',
  imports: [],
  templateUrl: './insight-card.html',
  styleUrl: './insight-card.css'
})
export class InsightCard {
@Input() insight:any
}
