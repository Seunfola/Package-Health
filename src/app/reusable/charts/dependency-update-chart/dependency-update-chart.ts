import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-dependency-update-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './dependency-update-chart.html',
  styleUrls: ['./dependency-update-chart.css'],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class DependencyUpdateChart {
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [15, 12, 18, 14, 20, 16],
        label: 'Critical',
        borderColor: '#E08F4D',
        backgroundColor: 'rgba(224,143,77,0.2)',
        pointBackgroundColor: '#E08F4D',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#E08F4D',
        fill: 'origin',
        tension: 0.4,
      },
      {
        data: [10, 8, 12, 10, 15, 12],
        label: 'Major',
        borderColor: '#E77C6B',
        backgroundColor: 'rgba(231,124,107,0.2)',
        pointBackgroundColor: '#E77C6B',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#E77C6B',
        fill: 'origin',
        tension: 0.4,
      },
      {
        data: [5, 4, 7, 5, 8, 6],
        label: 'Minor',
        borderColor: '#4D80A0',
        backgroundColor: 'rgba(77,128,160,0.2)',
        pointBackgroundColor: '#4D80A0',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#4D80A0',
        fill: 'origin',
        tension: 0.4,
      },
    ],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
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
