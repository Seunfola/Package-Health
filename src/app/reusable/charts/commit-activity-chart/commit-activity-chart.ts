import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-commit-activity-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './commit-activity-chart.html',
  styleUrls: ['./commit-activity-chart.css'],
})
export class CommitActivityChart {
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [550, 700, 550, 650, 500, 580, 500, 600],
        label: 'Commits',
        borderColor: '#4D80A0',
        pointBackgroundColor: '#4D80A0',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4D80A0',
        fill: 'origin',
        tension: 0.4,
      },
      {
        data: [1100, 1650, 1100, 1500, 2200, 1800, 1650, 1900],
        label: 'Additions',
        borderColor: '#E77C6B',
        pointBackgroundColor: '#E77C6B',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#E77C6B',
        fill: 'origin',
        tension: 0.4,
      },
      {
        data: [400, 550, 300, 450, 550, 450, 350, 400],
        label: 'Deletions',
        borderColor: '#008C8C',
        pointBackgroundColor: '#008C8C',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#008C8C',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    elements: {
      line: { borderWidth: 2 },
      point: { radius: 4, hoverRadius: 6 },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { color: '#343a40' },
        ticks: { stepSize: 550 },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: { boxWidth: 12, padding: 20 },
      },
    },
  };

  public lineChartType: ChartType = 'line';
}
