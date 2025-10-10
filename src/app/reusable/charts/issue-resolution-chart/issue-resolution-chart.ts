import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-issue-resolution-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './issue-resolution-chart.html',
  styleUrls: ['./issue-resolution-chart.css'],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class IssueResolutionChart {
  public barChartData: ChartConfiguration['data'] = {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6'],
    datasets: [
      {
        data: [12, 16, 18, 14, 15, 20],
        label: 'Opened Issues',
        backgroundColor: '#008C8C',
        borderColor: '#008C8C',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        data: [9, 11, 15, 12, 10, 16],
        label: 'Closed Issues',
        backgroundColor: '#E08F4D',
        borderColor: '#E08F4D',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        grid: { color: '#343a40' },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  public barChartType: ChartType = 'bar';
}
