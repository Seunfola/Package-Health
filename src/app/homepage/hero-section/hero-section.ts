import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/environment/environment.prod';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection {
  repository: string = '';
  githubToken: string = '';
  jsonContent: string = '';
  selectedFileName: string = 'No file chosen';
  activeTab: string = 'github';
  isAnalyzing: boolean = false;
  analysisResult: any = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  setActiveTab(tab: 'github' | 'json' | 'upload'): void {
    this.activeTab = tab;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFileName = input.files[0].name;
      console.log('Selected file:', this.selectedFileName);
    } else {
      this.selectedFileName = 'No file chosen';
    }
  }

  analyzeData() {
    switch (this.activeTab) {
      case 'github':
        this.analyzeRepository();
        break;
      case 'paste':
        this.analyzePastedJson();
        break;
      case 'upload':
        this.analyzeUploadedFile();
        break;
    }
  }

  analyzeRepository() {
    const repo = this.repository.trim();

    if (!repo) {
      alert('Please enter a GitHub repository!');
      return;
    }

    if (!this.githubToken.trim()) {
      alert(
        'Please provide a GitHub Personal Access Token! You can generate one at https://github.com/settings/tokens (select "repo" scope for full access).',
      );
      return;
    }

    // Construct the full GitHub URL if it's not already a full URL
    let githubUrl = repo;
    if (!repo.startsWith('http')) {
      githubUrl = `https://github.com/${repo}`;
    }

    this.isAnalyzing = true;

    const requestBody = {
      url: githubUrl,
      token: this.githubToken.trim(),
    };

    const apiEndpoint = `${environment.apiBaseUrl}/repo-health/analyze-url`;

    this.http.post(apiEndpoint, requestBody).subscribe({
      next: (response: any) => {
        this.analysisResult = response;
        console.log('Repository analysis result:', response);
        this.isAnalyzing = false;
        alert(
          `Analysis complete! Overall health score: ${response.overall_health?.score || 'N/A'}`,
        );
      },
      error: (error) => {
        console.error('Error analyzing repository:', error);
        this.isAnalyzing = false;
        if (error.status === 401 || error.status === 403) {
          alert('Invalid GitHub token. Please check your token and try again.');
        } else {
          alert('Error analyzing repository. Please check the input and try again.');
        }
      },
    });
  }

  analyzePastedJson() {
    if (!this.jsonContent.trim()) {
      alert('Please paste some JSON content!');
      return;
    }

    this.isAnalyzing = true;

    const requestBody = {
      json: this.jsonContent.trim(), // Send as string per endpoint schema
    };

    const apiEndpoint = `${environment.apiBaseUrl}/repo-health/analyze-package/paste`;

    this.http.post(apiEndpoint, requestBody).subscribe({
      next: (response: any) => {
        this.analysisResult = response;
        console.log('Pasted JSON analysis result:', response);
        this.isAnalyzing = false;
        alert(
          `Analysis complete! Overall health score: ${response.overall_health?.score || 'N/A'}`,
        );
      },
      error: (error) => {
        console.error('Error analyzing pasted JSON:', error);
        this.isAnalyzing = false;
        alert('Error analyzing pasted JSON. Please check the content and try again.');
      },
    });
  }

  analyzeUploadedFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    const uploadedFile =
      fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;

    if (!uploadedFile) {
      alert('Please choose a JSON file to upload!');
      return;
    }

    this.isAnalyzing = true;

    const formData = new FormData();
    formData.append('file', uploadedFile);

    const apiEndpoint = `${environment.apiBaseUrl}/repo-health/analyze-package/upload`;

    this.http.post(apiEndpoint, formData).subscribe({
      next: (response: any) => {
        this.analysisResult = response;
        console.log('Uploaded file analysis result:', response);
        this.isAnalyzing = false;
        alert(
          `Analysis complete! Overall health score: ${response.overall_health?.score || 'N/A'}`,
        );
      },
      error: (error) => {
        console.error('Error analyzing uploaded file:', error);
        this.isAnalyzing = false;
        alert('Error analyzing uploaded file. Please check the file and try again.');
      },
    });
  }
}
