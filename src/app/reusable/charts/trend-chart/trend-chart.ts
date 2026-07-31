import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trend-chart.html',
  styleUrl: './trend-chart.css'
})
export class TrendChart implements OnChanges {
  @Input() history: any[] = [];
  
  points: string = '';
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['history'] && this.history) {
      this.calculatePoints();
    }
  }

  calculatePoints() {
    if (this.history.length === 0) {
      this.points = '';
      return;
    }

    const width = 300;
    const height = 100;
    const maxScore = 100;
    
    // Distribute points evenly across width
    const stepX = this.history.length > 1 ? width / (this.history.length - 1) : width;
    
    this.points = this.history.map((scan, index) => {
      const x = index * stepX;
      // Invert Y axis because SVG starts 0 at top
      const y = height - (scan.trustScore / maxScore) * height;
      return `${x},${y}`;
    }).join(' ');
  }
}
