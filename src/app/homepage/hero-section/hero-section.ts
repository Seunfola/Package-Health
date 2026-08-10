import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AnalysisService } from '@/app/services/analysis.service';
import { AuthService } from '@/app/services/auth.service';
import { RepoHealthAnalysisService } from '@/app/services/repo-health-analysis.service';

type RepoVisibility = 'public' | 'private' | 'unknown';

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
  jsonContent: string = '';
  selectedFileName: string = 'No file chosen';
  activeTab: 'github' | 'paste' | 'upload' = 'github';
  isAnalyzing: boolean = false;
  analysisWarnings: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly analysisService: AnalysisService,
    private readonly authService: AuthService,
    private readonly repoHealthAnalysisService: RepoHealthAnalysisService,
  ) {}

  setActiveTab(tab: 'github' | 'paste' | 'upload') {
    this.activeTab = tab;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFileName = input.files?.[0]?.name || 'No file chosen';
    this.analysisWarnings = [];
  }

  analyzeData(): void {
    switch (this.activeTab) {
      case 'github':
        void this.analyzeRepository();
        return;
      case 'paste':
        this.analyzePastedJson();
        return;
      case 'upload':
        void this.analyzeUploadedFile();
        return;
    }
  }

  private async analyzeRepository(): Promise<void> {
    const repo = this.repository.trim();
    if (!repo) {
      alert('Please enter a GitHub repository URL or owner/repository name.');
      return;
    }

    const parsedRepo = this.parseRepositoryInput(repo);
    if (!parsedRepo) {
      alert('Enter a valid GitHub repository in this format: owner/repo or https://github.com/owner/repo.');
      return;
    }

    this.analysisWarnings = [];
    this.isAnalyzing = true;

    try {
      const visibility = await this.detectRepositoryVisibility(parsedRepo.owner, parsedRepo.name);
      const isAuthenticated = this.authService.isAuthenticated();

      if (visibility === 'private') {
        alert(
          isAuthenticated
            ? 'This repository appears to be private. Use the "Analyze Private Repository" form below — it needs a connected GitHub App installation, not a token.'
            : 'This repository appears to be private. Sign in, then use the "Analyze Private Repository" form below.',
        );
        return;
      }

      const response = await firstValueFrom(
        this.repoHealthAnalysisService.analyzeRepository(parsedRepo.url),
      );
      this.handleAnalysisResult(response);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isAnalyzing = false;
    }
  }

  private analyzePastedJson(): void {
    if (!this.jsonContent.trim()) {
      alert('Please paste a package.json payload before analyzing.');
      return;
    }

    const parsed = this.parsePackageJson(this.jsonContent.trim());
    if (!parsed) {
      alert('Invalid JSON. Please paste a valid package.json file content.');
      return;
    }

    this.analysisWarnings = this.getPackageSecurityWarnings(parsed);
    this.isAnalyzing = true;

    this.repoHealthAnalysisService
      .analyzeDependenciesFromJson(parsed)
      .subscribe({
        next: (res: any) => this.handleAnalysisResult(res),
        error: (err) => this.handleError(err),
        complete: () => {
          this.isAnalyzing = false;
        },
      });
  }

  private async analyzeUploadedFile(): Promise<void> {
    const file = this.fileInput?.nativeElement?.files?.[0];
    if (!file) {
      alert('Please choose a JSON file to upload.');
      return;
    }

    if (!this.isAcceptedPackageFile(file)) {
      alert('Only .json files up to 1MB are allowed.');
      return;
    }

    const fileContent = await file.text();
    const parsed = this.parsePackageJson(fileContent);
    if (!parsed) {
      alert('The uploaded file is not valid JSON.');
      return;
    }

    this.analysisWarnings = this.getPackageSecurityWarnings(parsed);

    this.isAnalyzing = true;
    try {
      const response = await firstValueFrom(
        this.repoHealthAnalysisService.analyzeDependenciesFromFile(file),
      );
      this.handleAnalysisResult(response);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isAnalyzing = false;
    }
  }

  private handleAnalysisResult(response: any) {
    this.analysisService.setAnalysis(response);
    void this.router.navigate(['/repo-details']);
  }

  private handleError(error: any) {
    if (error.status === 401 || error.status === 403) {
      alert(
        'Authentication required, or your GitHub App installation is not connected to this repository. Use the "Analyze Private Repository" form for private repos.',
      );
    } else if (error.status === 404 && this.activeTab === 'github') {
      alert(
        'Repository not found. If it is private, use the "Analyze Private Repository" form below. Otherwise verify the URL.',
      );
    } else {
      alert('Analysis failed. Please verify the input and try again.');
    }
  }

  private parseRepositoryInput(input: string): { owner: string; name: string; url: string } | null {
    const normalized = input.trim().replace(/\.git$/, '');
    if (normalized.length > 200) return null;

    const urlMatch = normalized.match(/^https:\/\/github\.com\/([^/\s]+)\/([^/\s]+)\/?$/i);
    if (urlMatch) {
      const owner = urlMatch[1];
      const name = urlMatch[2];
      return { owner, name, url: `https://github.com/${owner}/${name}` };
    }

    const shortMatch = normalized.match(/^([^/\s]+)\/([^/\s]+)$/);
    if (shortMatch) {
      const owner = shortMatch[1];
      const name = shortMatch[2];
      return { owner, name, url: `https://github.com/${owner}/${name}` };
    }

    return null;
  }

  /**
   * Unauthenticated probe against GitHub's public API — DepVault never holds
   * a GitHub credential to attach here (see AuthService; the DepVault
   * session JWT this used to send as a Bearer token isn't a GitHub
   * credential at all, GitHub would just reject it). A private repo 404s for
   * an anonymous request either way, which is exactly the signal this needs.
   */
  private async detectRepositoryVisibility(owner: string, name: string): Promise<RepoVisibility> {
    try {
      const headers: Record<string, string> = {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'DepVault',
      };

      const response = await fetch(`https://api.github.com/repos/${owner}/${name}`, { headers });
      if (!response.ok) return 'unknown';

      const repo = (await response.json()) as { private?: boolean };
      return repo.private ? 'private' : 'public';
    } catch {
      return 'unknown';
    }
  }

  private parsePackageJson(content: string): Record<string, unknown> | null {
    try {
      const parsed = JSON.parse(content) as Record<string, unknown>;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  private isAcceptedPackageFile(file: File): boolean {
    const isJson = file.name.toLowerCase().endsWith('.json');
    const maxSizeBytes = 1024 * 1024;
    return isJson && file.size <= maxSizeBytes;
  }

  private getPackageSecurityWarnings(pkg: Record<string, unknown>): string[] {
    const warnings: string[] = [];

    if (typeof pkg['name'] !== 'string' || !pkg['name'].trim()) {
      warnings.push('`name` is missing from package.json.');
    }
    if (typeof pkg['version'] !== 'string' || !pkg['version'].trim()) {
      warnings.push('`version` is missing from package.json.');
    }

    const dependencies = this.getObjectRecord(pkg['dependencies']);
    const devDependencies = this.getObjectRecord(pkg['devDependencies']);
    const allDependencies = { ...dependencies, ...devDependencies };

    Object.entries(allDependencies).forEach(([depName, depVersion]) => {
      if (typeof depVersion !== 'string') return;
      if (depVersion === '*' || depVersion === 'latest') {
        warnings.push(`Dependency \`${depName}\` uses an unsafe open version (\`${depVersion}\`).`);
      }
      if (/\s/.test(depVersion)) {
        warnings.push(`Dependency \`${depName}\` has an invalid version string.`);
      }
    });

    const scripts = this.getObjectRecord(pkg['scripts']);
    if (!scripts['test']) {
      warnings.push('No `test` script found. Add automated tests for safer changes.');
    }

    return warnings;
  }

  private getObjectRecord(value: unknown): Record<string, unknown> {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return {};
    }
    return value as Record<string, unknown>;
  }
}
