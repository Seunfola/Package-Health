import { Component, Inject, PLATFORM_ID, OnInit, Input } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

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

    if (this.isBrowser) {
      Chart.register(...registerables);
    }
  }
}
