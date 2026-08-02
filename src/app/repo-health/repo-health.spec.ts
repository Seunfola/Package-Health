import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RepoHealth } from './repo-health';
import { environment } from '@/environments/environment';

describe('RepoHealth', () => {
  let component: RepoHealth;
  let fixture: ComponentFixture<RepoHealth>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoHealth, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RepoHealth);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create and scan the default package on init', () => {
    expect(component).toBeTruthy();

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiUrl}/scan/npm/express` && r.method === 'GET',
    );
    req.flush({
      ecosystem: 'npm',
      package: 'express',
      version: '4.19.2',
      hasCriticalVulnerabilities: false,
      trustScore: {
        finalScore: 82,
        securityScore: 90,
        freshness: 0.9,
        categoryPrior: 0.3,
        diversity: { H: 1, Hnorm: 1, groupCount: 2 },
        ci: { p2_5: 78, p97_5: 86, p50: 82 },
        sensitivity: 0.1,
        vulnerabilityBurden: 0,
        subscores: { license: 100, maintenance: 80, popularity: 95, adjustedMaintenance: 72 },
      },
    });

    const historyReq = httpMock.expectOne(`${environment.apiUrl}/history/npm/express`);
    historyReq.flush([]);

    expect(component.scanResult?.trustScore.finalScore).toBe(82);
    expect(component.statusCards.length).toBeGreaterThan(0);
  });
});
