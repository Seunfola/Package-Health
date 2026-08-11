import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SettingsItem } from './settings-item/settings-item';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from './settings-card/settings-card';
import { SettingsInput } from './settings-input/settings-input';
import { AuthLogin } from '@/app/services/auth-login.component';
import { PrivateRepoAnalysisComponent } from '@/app/services/private-repo-analysis.component';
import { PreferencesService, UpdatePreferencesDto } from '@/app/services/preferences.service';
import { AuthService } from '@/app/services/auth.service';
import { GatekeeperService, GatekeeperPolicyConfig } from '@/app/services/gatekeeper.service';
import { OrganizationService, OrganizationMember, Organization, OrgInvitation, OrgAuditLogEntry, OrgUsage } from '@/app/services/organization.service';
import { NotificationWebhookService, NotificationWebhook, NotificationWebhookType } from '@/app/services/notification-webhook.service';
import { RepoService, RepoListItem } from '@/app/services/RepoService';
import { PersonalAccessTokenService, PersonalAccessTokenSummary } from '@/app/services/personal-access-token.service';
import { UnauthorizedWarning } from '@/app/shared/unauthorized-warning/unauthorized-warning';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    SettingsItem,
    FormsModule,
    SettingsCard,
    SettingsInput,
    AuthLogin,
    PrivateRepoAnalysisComponent,
    UnauthorizedWarning,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
  /** Angular templates can't reference the global `Infinity` directly — exposed here for the PAID-plan "unlimited" usage display. */
  readonly Infinity = Infinity;

  codeQualityScore = true;
  testCoverage = true;
  dependencyVulnerabilities = true;
  securityAlerts = true;

  emailNotifications = true;
  inAppNotifications = true;
  securityThreshold = '80'; // Keeping as string to match input, but will parse to number
  dependencyUpdateFrequency = 'Daily';

  frequencies = ['Daily', 'Weekly', 'Monthly'];
  
  isLoading = true;
  isSaving = false;
  message = '';

  // Personal Access Tokens — long-lived, revocable, used by the CLI/IDE
  // extension/CI instead of the short-lived (1h) browser session JWT.
  personalAccessTokens: PersonalAccessTokenSummary[] = [];
  isLoadingTokens = false;
  newTokenName = '';
  isCreatingToken = false;
  createTokenError = '';
  /** Set only immediately after creation — the raw value is never retrievable again, so this is cleared as soon as the user dismisses it. */
  justCreatedToken: string | null = null;
  revokingTokenId: string | null = null;
  patCopied = false;

  // Gatekeeper Policies State
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

  // Plan / usage / branding state
  orgUsage: OrgUsage | null = null;
  logoFile: File | null = null;
  isUploadingLogo = false;
  logoMessage = '';
  logoError = '';

  // Organization State
  newOwnerEmail = '';
  transferMessage = '';
  isTransferring = false;

  // Org switcher / creation state
  myOrgs: Organization[] = [];
  activeOrgId = 'default-org';
  isLoadingOrgs = false;
  newOrgName = '';
  isCreatingOrg = false;
  orgSwitcherMessage = '';
  orgSwitcherError = '';

  // Members State
  members: OrganizationMember[] = [];
  isLoadingMembers = false;
  newMemberEmail = '';
  newMemberRole: 'ADMIN' | 'MEMBER' = 'MEMBER';
  isAddingMember = false;
  memberMessage = '';
  memberError = '';

  // Invitations state (email-based, works even if the invitee has no account yet)
  invitations: OrgInvitation[] = [];
  isLoadingInvitations = false;
  newInviteEmail = '';
  newInviteRole: 'ADMIN' | 'MEMBER' = 'MEMBER';
  isInviting = false;
  inviteMessage = '';
  inviteError = '';

  // Audit log state
  auditLog: OrgAuditLogEntry[] = [];
  isLoadingAuditLog = false;
  auditLogError = '';

  // Notification Webhooks State
  webhooks: NotificationWebhook[] = [];
  isLoadingWebhooks = false;
  newWebhookType: NotificationWebhookType = 'slack';
  newWebhookUrl = '';
  newWebhookLabel = '';
  isAddingWebhook = false;
  webhookMessage = '';
  webhookError = '';
  webhookTypes: NotificationWebhookType[] = ['slack', 'discord', 'xmatters', 'custom'];

  myUploadedRepos: RepoListItem[] = [];
  isLoadingUploadedRepos = false;

  constructor(
    private readonly preferencesService: PreferencesService,
    private readonly authService: AuthService,
    private readonly gatekeeperService: GatekeeperService,
    private readonly organizationService: OrganizationService,
    private readonly notificationWebhookService: NotificationWebhookService,
    private readonly repoService: RepoService,
    private readonly personalAccessTokenService: PersonalAccessTokenService,
  ) {}

  get authState$() {
    return this.authService.authState$;
  }

  /** Scans uploaded via `depvault upload` — the only visibility into CLI cloud sync this dashboard has, beyond the CLI's own output. */
  loadMyUploadedRepos(): void {
    this.isLoadingUploadedRepos = true;
    this.repoService.getMyUploadedRepos().subscribe({
      next: (repos) => {
        this.myUploadedRepos = repos;
        this.isLoadingUploadedRepos = false;
      },
      error: (err) => {
        console.error('Failed to load uploaded scans', err);
        this.isLoadingUploadedRepos = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadPreferences();
    this.loadMyOrganizations();
    this.loadMyUploadedRepos();
    this.loadPersonalAccessTokens();
  }

  loadPersonalAccessTokens(): void {
    this.isLoadingTokens = true;
    this.personalAccessTokenService.list().subscribe({
      next: (tokens) => {
        this.personalAccessTokens = tokens;
        this.isLoadingTokens = false;
      },
      error: (err) => {
        console.error('Failed to load personal access tokens', err);
        this.isLoadingTokens = false;
      },
    });
  }

  createPersonalAccessToken(): void {
    const name = this.newTokenName.trim();
    if (!name || this.isCreatingToken) return;

    this.isCreatingToken = true;
    this.createTokenError = '';
    this.personalAccessTokenService.create(name).subscribe({
      next: ({ token, summary }) => {
        this.justCreatedToken = token;
        this.personalAccessTokens = [summary, ...this.personalAccessTokens];
        this.newTokenName = '';
        this.isCreatingToken = false;
      },
      error: (err) => {
        this.createTokenError = err?.error?.message || 'Failed to create token.';
        this.isCreatingToken = false;
      },
    });
  }

  dismissNewToken(): void {
    this.justCreatedToken = null;
    this.patCopied = false;
  }

  copyPatToken(token: string): void {
    navigator.clipboard.writeText(token).then(() => {
      this.patCopied = true;
      setTimeout(() => (this.patCopied = false), 3000);
    });
  }

  revokePersonalAccessToken(id: string): void {
    this.revokingTokenId = id;
    this.personalAccessTokenService.revoke(id).subscribe({
      next: () => {
        this.personalAccessTokens = this.personalAccessTokens.filter((t) => t.id !== id);
        this.revokingTokenId = null;
      },
      error: (err) => {
        console.error('Failed to revoke token', err);
        this.revokingTokenId = null;
      },
    });
  }

  /** Every org the user owns or belongs to — powers the org switcher. Falls back to the single-tenant 'default-org' behavior if this fails or comes back empty. */
  loadMyOrganizations(): void {
    this.isLoadingOrgs = true;
    this.organizationService.listMyOrganizations().subscribe({
      next: (orgs) => {
        this.myOrgs = orgs;
        if (orgs.length > 0 && !orgs.some((o) => o.orgId === this.activeOrgId)) {
          this.activeOrgId = orgs[0].orgId;
        }
        this.isLoadingOrgs = false;
        this.loadOrgScopedData();
      },
      error: (err) => {
        console.error('Failed to load organizations', err);
        this.isLoadingOrgs = false;
        this.loadOrgScopedData();
      },
    });
  }

  /** Re-fetches everything scoped to activeOrgId — called on load and whenever the switcher changes org. */
  loadOrgScopedData(): void {
    this.loadGatekeeperPolicies();
    this.loadMembers();
    this.loadWebhooks();
    this.loadInvitations();
    this.loadAuditLog();
    this.loadOrgUsage();
  }

  /** The currently-active org's full record (plan, logo, etc.) — myOrgs already carries everything, no separate fetch needed. */
  get currentOrg(): Organization | undefined {
    return this.myOrgs.find((o) => o.orgId === this.activeOrgId);
  }

  get isPaidOrg(): boolean {
    return this.currentOrg?.plan === 'PAID';
  }

  loadOrgUsage(): void {
    this.organizationService.getUsage(this.activeOrgId).subscribe({
      next: (usage) => (this.orgUsage = usage),
      error: (err) => console.error('Failed to load org usage', err),
    });
  }

  onLogoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.logoFile = input.files?.[0] ?? null;
  }

  uploadLogo(): void {
    if (!this.logoFile) return;
    this.isUploadingLogo = true;
    this.logoMessage = '';
    this.logoError = '';

    this.organizationService.setLogo(this.activeOrgId, this.logoFile).subscribe({
      next: () => {
        this.isUploadingLogo = false;
        this.logoMessage = 'Logo updated.';
        this.logoFile = null;
        this.loadMyOrganizations();
        setTimeout(() => (this.logoMessage = ''), 3000);
      },
      error: (err) => {
        this.isUploadingLogo = false;
        this.logoError = err.error?.message || 'Failed to upload logo.';
      },
    });
  }

  loadAuditLog(): void {
    this.isLoadingAuditLog = true;
    this.auditLogError = '';
    this.organizationService.getAuditLog(this.activeOrgId).subscribe({
      next: (entries) => {
        this.auditLog = entries;
        this.isLoadingAuditLog = false;
      },
      error: (err) => {
        // Non-admins get a 403 here (audit log is ADMIN+ only) — that's
        // expected, not an error worth surfacing loudly to a plain member.
        console.error('Failed to load audit log', err);
        this.isLoadingAuditLog = false;
      },
    });
  }

  /** "member.role_changed" -> "Role Changed" for a readable table without a giant switch/lookup map. */
  formatAuditAction(action: string): string {
    const withoutPrefix = action.includes('.') ? action.split('.').slice(1).join(' ') : action;
    return withoutPrefix
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  switchOrg(orgId: string): void {
    if (orgId === this.activeOrgId) return;
    this.activeOrgId = orgId;
    this.loadOrgScopedData();
  }

  createOrganization(): void {
    if (!this.newOrgName.trim()) return;
    this.isCreatingOrg = true;
    this.orgSwitcherMessage = '';
    this.orgSwitcherError = '';

    this.organizationService.createOrganization({ name: this.newOrgName.trim() }).subscribe({
      next: (org) => {
        this.isCreatingOrg = false;
        this.newOrgName = '';
        this.orgSwitcherMessage = `Organization "${org.name}" created.`;
        this.myOrgs = [...this.myOrgs, org];
        this.switchOrg(org.orgId);
        setTimeout(() => (this.orgSwitcherMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to create organization', err);
        this.isCreatingOrg = false;
        this.orgSwitcherError = err.error?.message || 'Failed to create organization.';
        setTimeout(() => (this.orgSwitcherError = ''), 3000);
      },
    });
  }

  loadMembers(): void {
    this.isLoadingMembers = true;
    this.organizationService.getMembers(this.activeOrgId).subscribe({
      next: (members) => {
        this.members = members;
        this.isLoadingMembers = false;
      },
      error: (err) => {
        console.error('Failed to load members', err);
        this.memberError = 'Failed to load organization members.';
        this.isLoadingMembers = false;
      }
    });
  }

  addMember(): void {
    if (!this.newMemberEmail) return;
    this.isAddingMember = true;
    this.memberMessage = '';
    this.memberError = '';

    this.organizationService.addMember(this.activeOrgId, { email: this.newMemberEmail, role: this.newMemberRole }).subscribe({
      next: () => {
        this.isAddingMember = false;
        this.memberMessage = 'Member added successfully.';
        this.newMemberEmail = '';
        this.loadMembers();
        setTimeout(() => this.memberMessage = '', 3000);
      },
      error: (err) => {
        console.error('Failed to add member', err);
        this.isAddingMember = false;
        this.memberError = err.error?.message || 'Failed to add member.';
        setTimeout(() => this.memberError = '', 3000);
      }
    });
  }

  removeMember(userId: string): void {
    if (!confirm('Are you sure you want to remove this member?')) return;

    this.memberMessage = '';
    this.memberError = '';

    this.organizationService.removeMember(this.activeOrgId, userId).subscribe({
      next: () => {
        this.memberMessage = 'Member removed successfully.';
        this.loadMembers();
        setTimeout(() => this.memberMessage = '', 3000);
      },
      error: (err) => {
        console.error('Failed to remove member', err);
        this.memberError = err.error?.message || 'Failed to remove member.';
        setTimeout(() => this.memberError = '', 3000);
      }
    });
  }

  updateRole(userId: string, newRole: 'ADMIN' | 'MEMBER'): void {
    this.memberMessage = '';
    this.memberError = '';

    this.organizationService.updateMemberRole(this.activeOrgId, userId, { role: newRole }).subscribe({
      next: () => {
        this.memberMessage = 'Role updated successfully.';
        this.loadMembers();
        setTimeout(() => this.memberMessage = '', 3000);
      },
      error: (err) => {
        console.error('Failed to update role', err);
        this.memberError = err.error?.message || 'Failed to update role.';
        this.loadMembers(); // reload to revert select box
        setTimeout(() => this.memberError = '', 3000);
      }
    });
  }

  loadInvitations(): void {
    this.isLoadingInvitations = true;
    this.organizationService.listInvitations(this.activeOrgId).subscribe({
      next: (invitations) => {
        this.invitations = invitations;
        this.isLoadingInvitations = false;
      },
      error: (err) => {
        console.error('Failed to load invitations', err);
        this.isLoadingInvitations = false;
      },
    });
  }

  sendInvitation(): void {
    if (!this.newInviteEmail) return;
    this.isInviting = true;
    this.inviteMessage = '';
    this.inviteError = '';

    this.organizationService
      .createInvitation(this.activeOrgId, { email: this.newInviteEmail, role: this.newInviteRole })
      .subscribe({
        next: () => {
          this.isInviting = false;
          this.inviteMessage = `Invitation sent to ${this.newInviteEmail}.`;
          this.newInviteEmail = '';
          this.loadInvitations();
          setTimeout(() => (this.inviteMessage = ''), 3000);
        },
        error: (err) => {
          console.error('Failed to send invitation', err);
          this.isInviting = false;
          this.inviteError = err.error?.message || 'Failed to send invitation.';
          setTimeout(() => (this.inviteError = ''), 3000);
        },
      });
  }

  revokeInvitation(invitationId: string): void {
    if (!confirm('Revoke this invitation?')) return;

    this.organizationService.revokeInvitation(this.activeOrgId, invitationId).subscribe({
      next: () => {
        this.inviteMessage = 'Invitation revoked.';
        this.loadInvitations();
        setTimeout(() => (this.inviteMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to revoke invitation', err);
        this.inviteError = err.error?.message || 'Failed to revoke invitation.';
        setTimeout(() => (this.inviteError = ''), 3000);
      },
    });
  }

  loadWebhooks(): void {
    this.isLoadingWebhooks = true;
    this.notificationWebhookService.list(this.activeOrgId).subscribe({
      next: (webhooks) => {
        this.webhooks = webhooks;
        this.isLoadingWebhooks = false;
      },
      error: (err) => {
        console.error('Failed to load notification webhooks', err);
        this.webhookError = 'Failed to load notification webhooks.';
        this.isLoadingWebhooks = false;
      },
    });
  }

  addWebhook(): void {
    if (!this.newWebhookUrl) return;
    this.isAddingWebhook = true;
    this.webhookMessage = '';
    this.webhookError = '';

    this.notificationWebhookService
      .create(
        {
          type: this.newWebhookType,
          url: this.newWebhookUrl,
          label: this.newWebhookLabel || undefined,
        },
        this.activeOrgId,
      )
      .subscribe({
        next: () => {
          this.isAddingWebhook = false;
          this.webhookMessage = 'Webhook added successfully.';
          this.newWebhookUrl = '';
          this.newWebhookLabel = '';
          this.loadWebhooks();
          setTimeout(() => (this.webhookMessage = ''), 3000);
        },
        error: (err) => {
          console.error('Failed to add webhook', err);
          this.isAddingWebhook = false;
          this.webhookError = err.error?.message || 'Failed to add webhook.';
          setTimeout(() => (this.webhookError = ''), 3000);
        },
      });
  }

  toggleWebhookEnabled(webhook: NotificationWebhook): void {
    const enabled = !webhook.enabled;
    this.notificationWebhookService.update(webhook._id, { enabled }, this.activeOrgId).subscribe({
      next: () => {
        webhook.enabled = enabled;
      },
      error: (err) => {
        console.error('Failed to update webhook', err);
        this.webhookError = err.error?.message || 'Failed to update webhook.';
        setTimeout(() => (this.webhookError = ''), 3000);
      },
    });
  }

  removeWebhook(id: string): void {
    if (!confirm('Are you sure you want to remove this webhook?')) return;

    this.webhookMessage = '';
    this.webhookError = '';

    this.notificationWebhookService.remove(id, this.activeOrgId).subscribe({
      next: () => {
        this.webhookMessage = 'Webhook removed successfully.';
        this.loadWebhooks();
        setTimeout(() => (this.webhookMessage = ''), 3000);
      },
      error: (err) => {
        console.error('Failed to remove webhook', err);
        this.webhookError = err.error?.message || 'Failed to remove webhook.';
        setTimeout(() => (this.webhookError = ''), 3000);
      },
    });
  }

  loadGatekeeperPolicies(): void {
    this.gatekeeperService.getPolicies(this.activeOrgId).subscribe({
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
      },
      error: (err) => console.error('Failed to load gatekeeper policies', err)
    });
  }

  /** Live sum shown next to the weight sliders — must read 100 before saving. */
  get weightsSum(): number {
    return this.weightSecurity + this.weightLicense + this.weightMaintenance + this.weightPopularity;
  }

  loadPreferences(): void {
    this.isLoading = true;
    this.preferencesService.getPreferences().subscribe({
      next: (prefs) => {
        const db = prefs.dashboardMetrics;
        const np = prefs.notificationPreferences;
        
        this.codeQualityScore = db.codeQualityScore;
        this.testCoverage = db.testCoverage;
        this.dependencyVulnerabilities = db.dependencyVulnerabilities;
        this.securityAlerts = db.securityAlerts;
        
        this.emailNotifications = np.emailNotifications;
        this.inAppNotifications = np.inAppNotifications;
        this.securityThreshold = np.securityAlertThreshold.toString();
        this.dependencyUpdateFrequency = np.dependencyUpdateFrequency.charAt(0).toUpperCase() + np.dependencyUpdateFrequency.slice(1);
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load preferences', err);
        // Fallback to defaults or keep UI defaults if backend has no preferences yet
        this.isLoading = false;
      }
    });
  }

  resetPreferencesToDefaults(): void {
    this.isSaving = true;
    this.message = '';
    this.preferencesService.resetToDefaults().subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Preferences reset to defaults.';
        this.loadPreferences();
      },
      error: (err) => {
        console.error('Failed to reset preferences', err);
        this.isSaving = false;
        this.message = 'Failed to reset preferences.';
      },
    });
  }

  savePreferences(): void {
    this.isSaving = true;
    this.message = '';
    
    const payload: UpdatePreferencesDto = {
      dashboardMetrics: {
        codeQualityScore: this.codeQualityScore,
        testCoverage: this.testCoverage,
        dependencyVulnerabilities: this.dependencyVulnerabilities,
        securityAlerts: this.securityAlerts,
      },
      notificationPreferences: {
        emailNotifications: this.emailNotifications,
        inAppNotifications: this.inAppNotifications,
        securityAlertThreshold: parseInt(this.securityThreshold.replace('%', ''), 10) || 80,
        dependencyUpdateFrequency: this.dependencyUpdateFrequency.toLowerCase(),
      }
    };

    this.preferencesService.updatePreferences(payload).subscribe({
      next: () => {
        this.saveGatekeeperPolicies();
      },
      error: (err) => {
        console.error('Failed to save preferences', err);
        this.isSaving = false;
        this.message = 'Failed to save preferences.';
      }
    });
  }

  saveGatekeeperPolicies(): void {
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
        threshold: parseInt(this.ghostTownThreshold, 10) || 30
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

    this.gatekeeperService.updatePolicies(this.activeOrgId, gatekeeperPayload).subscribe({
      next: () => {
        this.isSaving = false;
        this.message = 'Organization Settings saved successfully!';
        setTimeout(() => this.message = '', 3000);
      },
      error: (err) => {
        console.error('Failed to save gatekeeper policies', err);
        this.isSaving = false;
        this.message = 'Failed to save Gatekeeper settings. Check thresholds.';
      }
    });
  }

  initiateTransfer(): void {
    if (!this.newOwnerEmail) return;
    this.isTransferring = true;
    this.transferMessage = '';

    this.organizationService.initiateTransfer(this.activeOrgId, { newOwnerEmail: this.newOwnerEmail }).subscribe({
      next: (res) => {
        this.isTransferring = false;
        // The backend emails the new owner a link to /accept-transfer — there's
        // nothing left for this screen to show beyond its own success message.
        this.transferMessage = res.message;
        this.newOwnerEmail = '';
      },
      error: (err) => {
        console.error('Failed to transfer ownership', err);
        this.isTransferring = false;
        this.transferMessage = err.error?.message || 'Failed to initiate transfer. Does the user exist?';
      }
    });
  }
}
