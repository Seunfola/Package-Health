import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { HeroSection } from './hero-section';
import { AnalysisService } from '@/app/services/analysis.service';
import { AuthService } from '@/app/services/auth.service';
import { environment } from '@/environment/environment';

describe('HeroSection', () => {
  let component: HeroSection;
  let fixture: ComponentFixture<HeroSection>;
  let httpMock: HttpTestingController;
  let analysisService: jasmine.SpyObj<AnalysisService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    analysisService = jasmine.createSpyObj<AnalysisService>('AnalysisService', ['setAnalysis']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['isAuthenticated', 'getToken']);
    authService.isAuthenticated.and.returnValue(false);
    authService.getToken.and.returnValue(undefined);

    await TestBed.configureTestingModule({
      imports: [HeroSection, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: AnalysisService, useValue: analysisService },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject invalid repository input', async () => {
    component.activeTab = 'github';
    component.repository = 'not a repo';
    spyOn(window, 'alert');

    await (component as any).analyzeRepository();

    expect(window.alert).toHaveBeenCalled();
  });

  it('should require authentication for detected private repositories', async () => {
    component.activeTab = 'github';
    component.repository = 'owner/private-repo';
    spyOn(window, 'alert');
    spyOn<any>(component, 'detectRepositoryVisibility').and.resolveTo('private');
    authService.isAuthenticated.and.returnValue(false);

    await (component as any).analyzeRepository();

    const firstMessage = (window.alert as jasmine.Spy).calls.mostRecent().args[0] as string;
    expect(firstMessage.toLowerCase()).toContain('private');
  });

  it('should post package json paste payload and record warnings', () => {
    component.activeTab = 'paste';
    component.jsonContent =
      '{"name":"demo","version":"1.0.0","dependencies":{"left-pad":"latest"},"scripts":{}}';

    component.analyzeData();

    const request = httpMock.expectOne(`${environment.apiBaseUrl}/repo-health/analyze-package/paste`);
    expect(request.request.method).toBe('POST');
    request.flush({ repoName: 'demo' });

    expect(component.analysisWarnings.length).toBeGreaterThan(0);
    expect(analysisService.setAnalysis).toHaveBeenCalled();
  });

  it('should parse full GitHub URL input', () => {
    const parsed = (component as any).parseRepositoryInput('https://github.com/org/repo');
    expect(parsed).toEqual({
      owner: 'org',
      name: 'repo',
      url: 'https://github.com/org/repo',
    });
  });
});
