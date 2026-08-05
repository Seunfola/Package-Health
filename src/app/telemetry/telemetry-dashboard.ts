import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { TelemetryService, TelemetrySummary } from '../services/telemetry.service';
import { StatusCard } from '../reusable/status-card/status-card';
import { LineChart } from '../repo-details/line-chart/line-chart';

/**
 * Platform-operator-only usage dashboard (route-guarded by backend
 * PlatformAdminGuard; the sidebar link itself is hidden from non-admins,
 * see Sidebar.menuItems). Shows anonymous, aggregate CLI/MCP/LSP usage —
 * no package names, no user identity, no IPs (see PRIVACY_AND_DATA.md).
 */
@Component({
  selector: 'app-telemetry-dashboard',
  standalone: true,
  imports: [CommonModule, StatusCard, LineChart],
  templateUrl: './telemetry-dashboard.html',
  styleUrl: './telemetry-dashboard.css',
})
export class TelemetryDashboard implements OnInit {
  isLoading = true;
  errorMessage = '';
  isForbidden = false;

  totalPings = 0;
  distinctInstalls = 0;

  dailyChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  sourceChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  toolChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  readonly lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { ticks: { color: '#9CA3AF' } }, y: { ticks: { color: '#9CA3AF' }, beginAtZero: true } },
  };

  readonly barChartOptions: ChartOptions = {
    ...this.lineChartOptions,
    indexAxis: 'y',
  };

  constructor(private readonly telemetryService: TelemetryService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.isForbidden = false;

    this.telemetryService.getSummary(90).subscribe({
      next: (summary) => {
        this.applySummary(summary);
        this.isLoading = false;
      },
      error: (err) => {
        if (err.status === 403) {
          this.isForbidden = true;
        } else {
          this.errorMessage = 'Failed to load telemetry summary.';
        }
        this.isLoading = false;
      },
    });
  }

  private applySummary(summary: TelemetrySummary): void {
    this.totalPings = summary.totalPings;
    this.distinctInstalls = summary.distinctInstalls;

    this.dailyChartData = {
      labels: summary.dailyCounts.map((d) => d.date),
      datasets: [
        {
          data: summary.dailyCounts.map((d) => d.count),
          label: 'Invocations',
          borderColor: '#00E5FF',
          backgroundColor: 'rgba(0, 229, 255, 0.15)',
          fill: true,
          tension: 0.3,
        },
      ],
    };

    this.sourceChartData = {
      labels: summary.bySource.map((s) => s.source),
      datasets: [{ data: summary.bySource.map((s) => s.count), label: 'Invocations', backgroundColor: '#00E5FF' }],
    };

    this.toolChartData = {
      labels: summary.byTool.map((t) => t.tool),
      datasets: [{ data: summary.byTool.map((t) => t.count), label: 'Invocations', backgroundColor: '#00FF88' }],
    };
  }
}
