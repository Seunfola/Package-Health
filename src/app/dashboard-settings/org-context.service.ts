import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Organization, OrganizationService, OrgUsage } from '@/app/services/organization.service';

/**
 * The active-organization switcher used to live entirely inside the one
 * giant Settings component. Splitting Settings into subroutes
 * (Organization/Members/Gatekeeper/Webhooks all read data scoped to
 * `activeOrgId`) means that switch has to be shared state instead —
 * otherwise switching org on one page wouldn't affect any other, and each
 * page would show a different organization's data. This service is that
 * shared source of truth; `providedIn: 'root'` so every settings subpage
 * injects the same instance.
 */
@Injectable({ providedIn: 'root' })
export class OrgContextService {
  /** Angular templates can't reference the global `Infinity` directly — exposed for the PAID-plan "unlimited" usage display. */
  readonly Infinity = Infinity;

  private readonly activeOrgIdSubject = new BehaviorSubject<string>('default-org');
  readonly activeOrgId$ = this.activeOrgIdSubject.asObservable();
  get activeOrgId(): string {
    return this.activeOrgIdSubject.value;
  }

  myOrgs: Organization[] = [];
  isLoadingOrgs = false;
  orgUsage: OrgUsage | null = null;

  constructor(private readonly organizationService: OrganizationService) {
    // Loads itself once, on first injection, rather than requiring every
    // settings subpage to remember to call this in its own ngOnInit — a
    // user can land directly on any of Organization/Members/Gatekeeper/
    // Webhooks via a deep link or the sidebar, not necessarily Organization
    // first.
    this.loadMyOrganizations();
  }

  get currentOrg(): Organization | undefined {
    return this.myOrgs.find((o) => o.orgId === this.activeOrgId);
  }

  get isPaidOrg(): boolean {
    return this.currentOrg?.plan === 'PAID';
  }

  /** Every org the user owns or belongs to. Falls back to the single-tenant 'default-org' behavior if this fails or comes back empty. */
  loadMyOrganizations(): void {
    this.isLoadingOrgs = true;
    this.organizationService.listMyOrganizations().subscribe({
      next: (orgs) => {
        this.myOrgs = orgs;
        if (orgs.length > 0 && !orgs.some((o) => o.orgId === this.activeOrgId)) {
          this.activeOrgIdSubject.next(orgs[0].orgId);
        }
        this.isLoadingOrgs = false;
        this.loadOrgUsage();
      },
      error: (err) => {
        console.error('Failed to load organizations', err);
        this.isLoadingOrgs = false;
      },
    });
  }

  switchOrg(orgId: string): void {
    if (orgId === this.activeOrgId) return;
    this.activeOrgIdSubject.next(orgId);
    this.loadOrgUsage();
  }

  /** Optimistic update after creating an org — appends it locally and switches to it, instead of a full re-fetch. */
  addOrgAndSwitch(newOrg: Organization): void {
    this.myOrgs = [...this.myOrgs, newOrg];
    this.switchOrg(newOrg.orgId);
  }

  loadOrgUsage(): void {
    this.organizationService.getUsage(this.activeOrgId).subscribe({
      next: (usage) => (this.orgUsage = usage),
      error: (err) => console.error('Failed to load org usage', err),
    });
  }

  /** Re-fetches myOrgs (e.g. after a logo upload) without disturbing the current activeOrgId selection logic. */
  refreshOrgs(): void {
    this.organizationService.listMyOrganizations().subscribe({
      next: (orgs) => (this.myOrgs = orgs),
      error: (err) => console.error('Failed to refresh organizations', err),
    });
  }
}
