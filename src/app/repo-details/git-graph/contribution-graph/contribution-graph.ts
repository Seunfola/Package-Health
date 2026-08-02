import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DayCell {
  date: string;
  count: number;
  level: number;
}

@Component({
  selector: 'app-contribution-graph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contribution-graph.html',
  styleUrls: ['./contribution-graph.css']
})
export class ContributionGraph implements OnChanges {
  @Input() data: { date: string; count: number }[] = [];
  
  weeks: DayCell[][] = [];
  months: { name: string; offset: number }[] = [];
  totalContributions = 0;
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.generateGraph();
    }
  }

  generateGraph() {
    this.weeks = [];
    this.months = [];
    this.totalContributions = 0;
    
    const dataMap = new Map<string, number>();
    this.data.forEach(d => {
      dataMap.set(d.date, d.count);
      this.totalContributions += d.count;
    });

    const today = new Date();
    // Start 365 days ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 365);
    
    // Adjust to previous Sunday to align weeks
    while (startDate.getDay() !== 0) {
      startDate.setDate(startDate.getDate() - 1);
    }
    
    let currentWeek: DayCell[] = [];
    const currentDate = new Date(startDate);
    let lastMonth = -1;
    let weekCount = 0;

    while (currentDate <= today || currentDate.getDay() !== 0) {
      if (currentDate > today && currentDate.getDay() === 0) {
        break;
      }
      
      const dateString = currentDate.toISOString().split('T')[0];
      const count = dataMap.get(dateString) || 0;
      
      let level = 0;
      if (count > 0 && count <= 2) level = 1;
      else if (count > 2 && count <= 5) level = 2;
      else if (count > 5 && count <= 10) level = 3;
      else if (count > 10) level = 4;
      
      currentWeek.push({
        date: dateString,
        count,
        level
      });
      
      if (currentDate.getDate() === 1) {
        const monthName = currentDate.toLocaleString('default', { month: 'short' });
        this.months.push({ name: monthName, offset: weekCount });
      } else if (lastMonth === -1) {
        const monthName = currentDate.toLocaleString('default', { month: 'short' });
        this.months.push({ name: monthName, offset: weekCount });
        lastMonth = currentDate.getMonth();
      }
      
      if (currentDate.getMonth() !== lastMonth && currentDate.getDate() !== 1) {
        lastMonth = currentDate.getMonth();
      }

      currentDate.setDate(currentDate.getDate() + 1);
      
      if (currentDate.getDay() === 0) {
        this.weeks.push(currentWeek);
        currentWeek = [];
        weekCount++;
      }
    }
  }
}
