import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';

import { GatekeeperSettings } from './gatekeeper';
import { GatekeeperService, GatekeeperPolicyConfig } from '@/app/services/gatekeeper.service';

describe('GatekeeperSettings', () => {
  let component: GatekeeperSettings;
  let fixture: ComponentFixture<GatekeeperSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatekeeperSettings],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GatekeeperSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/**
 * Regression coverage for the staff-eng audit finding: the Gatekeeper policy
 * form had no role-gating at all, even though the backend's PUT
 * policies/:orgId is @RequireOrgRole('ADMIN') and 403s for a plain member.
 * The GET is member-readable (no load-time signal — unlike members.ts's
 * ADMIN-gated audit-log GET), so a 403 on save is the first point the UI can
 * learn the caller isn't an admin; that should lock the form and show a
 * message that actually says so, not the generic threshold-check message.
 */
describe('GatekeeperSettings admin gating', () => {
  let component: GatekeeperSettings;
  let fixture: ComponentFixture<GatekeeperSettings>;
  let gatekeeperService: jasmine.SpyObj<GatekeeperService>;

  const samplePolicy: GatekeeperPolicyConfig = {
    block_critical_cves: { enabled: true },
    block_ghost_towns: { enabled: true, threshold: 30 },
    block_gpl_licenses: { enabled: false },
    warn_ecosystem_conflicts: { enabled: true },
  };

  beforeEach(async () => {
    gatekeeperService = jasmine.createSpyObj<GatekeeperService>('GatekeeperService', [
      'getPolicies',
      'updatePolicies',
    ]);
    gatekeeperService.getPolicies.and.returnValue(of(samplePolicy));

    await TestBed.configureTestingModule({
      imports: [GatekeeperSettings],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: GatekeeperService, useValue: gatekeeperService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GatekeeperSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('starts optimistic: isAdmin true and the form enabled before any save attempt', () => {
    expect(component.isAdmin).toBeTrue();
  });

  it('locks the form and shows an admin-specific message on a 403 save response', () => {
    gatekeeperService.updatePolicies.and.returnValue(throwError(() => ({ status: 403 })));

    component.savePolicies();

    expect(component.isAdmin).toBeFalse();
    expect(component.message).toBe('You need admin access to change Gatekeeper settings for this organization.');
  });

  it('keeps the generic message (and isAdmin true) for a non-403 save failure', () => {
    gatekeeperService.updatePolicies.and.returnValue(throwError(() => ({ status: 500 })));

    component.savePolicies();

    expect(component.isAdmin).toBeTrue();
    expect(component.message).toBe('Failed to save Gatekeeper settings. Check thresholds.');
  });
});
