import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from '../settings/settings-card/settings-card';
import { SettingsItem } from '../settings/settings-item/settings-item';
import { SettingsInput } from '../settings/settings-input/settings-input';
import { OrgContextService } from '../org-context.service';
import { GatekeeperService, GatekeeperPolicyConfig } from '@/app/services/gatekeeper.service';

/**
 * Reacts to OrgContextService.activeOrgId$ (not just a one-time read at
 * ngOnInit) — the org switcher lives on the Organization page now, so this
 * page has to notice when the user switches org elsewhere and reload the
 * right org's policy, not silently keep showing the previous one.
 */
@Component({
  selector: 'app-gatekeeper-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsCard, SettingsItem, SettingsInput],
  templateUrl: './gatekeeper.html',
  styleUrls: ['./gatekeeper.css', '../settings-shared.css'],
})
export class GatekeeperSettings implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  blockCriticalCves = true;
  blockGhostTowns = true;
  ghostTownThreshold = '30';
  blockGplLicenses = false;
  warnEcosystemConflicts = true;

  // Custom scoring weights (PAID only) — unset by default, falling back to
  // @depvault/core's own 45/20/20/15 split.
  useCustomWeights = false;
  weightSecurity = 45;
  weightLicense = 20;
  weightMaintenance = 20;
  weightPopularity = 15;
  weightsError = '';

  isSaving = false;
  message = '';
  loadError = '';

  // Optimistic until proven otherwise: GET /gatekeeper/policies/:orgId is
  // readable by any org member, so unlike members.ts's audit log (which is
  // ADMIN-gated on the read itself) there's no load-time signal here — only
  // the PUT is @RequireOrgRole('ADMIN'). A 403 on save is therefore the
  // first point we learn the caller isn't an admin; once we do, disable
  // further edits rather than let them keep hitting the same 403.
  isAdmin = true;

  constructor(
    readonly org: OrgContextService,
    private readonly gatekeeperService: GatekeeperService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadGatekeeperPolicies();
    this.org.activeOrgId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadGatekeeperPolicies());
  }

  loadGatekeeperPolicies(): void {
    this.loadError = '';
    this.gatekeeperService.getPolicies(this.org.activeOrgId).subscribe({
      next: (config) => {
        this.blockCriticalCves = config.block_critical_cves.enabled;
        this.blockGhostTowns = config.block_ghost_towns.enabled;
        this.ghostTownThreshold = (config.block_ghost_towns.threshold ?? 30).toString();
        this.blockGplLicenses = config.block_gpl_licenses.enabled;
        this.warnEcosystemConflicts = config.warn_ecosystem_conflicts.enabled;

        this.useCustomWeights = !!config.scoringWeights;
        if (config.scoringWeights) {
          this.weightSecurity = Math.round(config.scoringWeights.security * 100);
          this.weightLicense = Math.round(config.scoringWeights.license * 100);
          this.weightMaintenance = Math.round(config.scoringWeights.maintenance * 100);
          this.weightPopularity = Math.round(config.scoringWeights.popularity * 100);
        }
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load gatekeeper policies', err);
        this.loadError = 'Failed to load your current Gatekeeper policy — showing defaults below, which may not match what is actually saved.';
        this.cdr.markForCheck();
      },
    });
  }

  /** Live sum shown next to the weight sliders — must read 100 before saving. */
  get weightsSum(): number {
    return this.weightSecurity + this.weightLicense + this.weightMaintenance + this.weightPopularity;
  }

  savePolicies(): void {
    this.isSaving = true;
    this.message = '';
    this.weightsError = '';

    if (this.useCustomWeights && this.weightsSum !== 100) {
      this.isSaving = false;
      this.weightsError = `Weights must sum to 100 (currently ${this.weightsSum}).`;
      return;
    }

    const gatekeeperPayload: GatekeeperPolicyConfig = {
      block_critical_cves: { enabled: this.blockCriticalCves },
      block_ghost_towns: {
        enabled: this.blockGhostTowns,
        threshold: parseInt(this.ghostTownThreshold, 10) || 30,
      },
      block_gpl_licenses: { enabled: this.blockGplLicenses },
      warn_ecosystem_conflicts: { enabled: this.warnEcosystemConflicts },
      ...(this.useCustomWeights
        ? {
            scoringWeights: {
              security: this.weightSecurity / 100,
              license: this.weightLicense / 100,
              maintenance: this.weightMaintenance / 100,
              popularity: this.weightPopularity / 100,
            },
          }
        : {}),
    };

    this.gatekeeperService.updatePolicies(this.org.activeOrgId, gatekeeperPayload).subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Gatekeeper policy saved successfully!';
        this.cdr.markForCheck();
        setTimeout(() => {
          this.message = '';
          this.cdr.markForCheck();
        }, 3000);
      },
      error: (err) => {
        console.error('Failed to save gatekeeper policies', err);
        this.isSaving = false;
        if (err.status === 403) {
          // Same class of ADMIN-only rejection members.ts's audit log
          // silently absorbs on load — here we surface it once, clearly,
          // and lock the form so the member isn't invited to keep retrying
          // a save that will never succeed for their role.
          this.isAdmin = false;
          this.message = 'You need admin access to change Gatekeeper settings for this organization.';
        } else {
          this.message = 'Failed to save Gatekeeper settings. Check thresholds.';
        }
        this.cdr.markForCheck();
      },
    });
  }
}
