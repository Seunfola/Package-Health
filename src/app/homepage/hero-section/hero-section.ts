import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@/environment/environment.prod';
import { AnalysisService } from '@/app/services/analysis.service';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.css'],
})
export class HeroSection {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  repository: string = '';
  githubToken: string = '';
  jsonContent: string = '';
  selectedFileName: string = 'No file chosen';
  activeTab: 'github' | 'paste' | 'upload' = 'github';
  isAnalyzing: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private analysisService: AnalysisService,
  ) {}

  setActiveTab(tab: 'github' | 'paste' | 'upload') {
    this.activeTab = tab;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFileName = input.files?.[0]?.name || 'No file chosen';
  }

  analyzeData() {
    switch (this.activeTab) {
      case 'github':
        return this.analyzeRepository();
      case 'paste':
        return this.analyzePastedJson();
      case 'upload':
        return this.analyzeUploadedFile();
    }
  }

  private analyzeRepository() {
    const repo = this.repository.trim();
    if (!repo) return alert('Please enter a GitHub repository!');
    if (!this.githubToken.trim()) return alert('Please provide a GitHub Personal Access Token!');

    const githubUrl = repo.startsWith('http') ? repo : `https://github.com/${repo}`;
    this.isAnalyzing = true;

    this.http
      .post(`${environment.apiBaseUrl}/repo-health/analyze-url`, {
        url: githubUrl,
        token: this.githubToken.trim(),
      })
      .subscribe({
        next: (res: any) => this.handleAnalysisResult(res),
        error: (err) => this.handleError(err),
      });
  }

  private analyzePastedJson() {
    if (!this.jsonContent.trim()) return alert('Please paste some JSON content!');
    this.isAnalyzing = true;

    this.http
      .post(`${environment.apiBaseUrl}/repo-health/analyze-package/paste`, {
        json: this.jsonContent.trim(),
      })
      .subscribe({
        next: (res: any) => this.handleAnalysisResult(res),
        error: (err) => this.handleError(err),
      });
  }

  private analyzeUploadedFile() {
    const file = this.fileInput?.nativeElement?.files?.[0];
    if (!file) return alert('Please choose a JSON file to upload!');

    const formData = new FormData();
    formData.append('file', file);

    this.isAnalyzing = true;

    this.http
      .post(`${environment.apiBaseUrl}/repo-health/analyze-package/upload`, formData)
      .subscribe({
        next: (res: any) => this.handleAnalysisResult(res),
        error: (err) => this.handleError(err),
      });
  }

  private handleAnalysisResult(response: any) {
    this.isAnalyzing = false;
    console.log('Analysis result:', response);
    this.analysisService.setAnalysis(response);
    this.router.navigate(['/repo-details']);
  }

  private handleError(error: any) {
    this.isAnalyzing = false;
    console.error('Error analyzing:', error);
    if (error.status === 401 || error.status === 403) {
      alert('Invalid GitHub token. Please check your token.');
    } else {
      alert('Error analyzing repository. Please check input and try again.');
    }
  }
}
