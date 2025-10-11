import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.html',
  styleUrls: ['./line-chart.css'],
})
export class LineChart implements OnInit {
  @Input() lineChartData: ChartConfiguration['data'] = { datasets: [], labels: [] };
  @Input() lineChartOptions: ChartOptions = {};
  @Input() lineChartType: ChartType = 'line';

  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
}
