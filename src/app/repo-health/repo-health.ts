import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCard } from '../reusable/status-card/status-card';
import { TrendChart } from '../reusable/charts/trend-chart/trend-chart';
import { ScannerService, ScanResult } from '../services/scanner.service';

@Component({
  selector: 'app-repo-health',
  standalone: true,
  imports: [
    CommonModule,
    StatusCard,
    TrendChart,
  ],
  templateUrl: './repo-health.html',
  styleUrl: './repo-health.css',
})
export class RepoHealth implements OnInit {
  trustScore = 100;
  lastScanned = 'Fetching...';
  hasCriticalVulnerabilities = false;
  riskyDependencies: any[] = [];
  statusCards: any[] = [];
  scanHistory: any[] = [];
  isLoading = true;

  constructor(private scannerService: ScannerService) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    // We scan 'express' as an MVP example
    this.scannerService.scanPackage('npm', 'express', 'latest').subscribe({
      next: (result: ScanResult) => {
        this.trustScore = result.trustScore;
        this.lastScanned = result.lastScanned;
        this.hasCriticalVulnerabilities = result.hasCriticalVulnerabilities;
        this.riskyDependencies = result.riskyDependencies;
        this.statusCards = result.statusCards;
        this.isLoading = false;

        // Fetch historical data after successful scan
        this.scannerService.getScanHistory('npm', 'express').subscribe(
          history => this.scanHistory = history
        );
      },
      error: (err) => {
        console.error('Failed to fetch trust score', err);
        // Fallback to error UI / mock data if backend isn't running yet
        this.lastScanned = 'Error fetching data';
        this.isLoading = false;
      }
    });
  }

  get strokeDashoffset(): number {
    const circumference = 2 * Math.PI * 45; // r=45
    return circumference - (this.trustScore / 100) * circumference;
  }
}
