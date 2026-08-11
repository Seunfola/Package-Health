import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SettingsCard } from '../settings/settings-card/settings-card';
import { OrgContextService } from '../org-context.service';
import { NotificationWebhookService, NotificationWebhook, NotificationWebhookType } from '@/app/services/notification-webhook.service';

@Component({
  selector: 'app-webhooks-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, SettingsCard],
  templateUrl: './webhooks.html',
  styleUrls: ['./webhooks.css', '../settings-shared.css'],
})
export class WebhooksSettings implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  webhooks: NotificationWebhook[] = [];
  isLoadingWebhooks = false;
  newWebhookType: NotificationWebhookType = 'slack';
  newWebhookUrl = '';
  newWebhookLabel = '';
  isAddingWebhook = false;
  webhookMessage = '';
  webhookError = '';
  webhookTypes: NotificationWebhookType[] = ['slack', 'discord', 'xmatters', 'custom'];

  constructor(
    readonly org: OrgContextService,
    private readonly notificationWebhookService: NotificationWebhookService,
  ) {}

  ngOnInit(): void {
    this.loadWebhooks();
    this.org.activeOrgId$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadWebhooks());
  }

  loadWebhooks(): void {
    this.isLoadingWebhooks = true;
    this.notificationWebhookService.list(this.org.activeOrgId).subscribe({
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
        this.org.activeOrgId,
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
    this.notificationWebhookService.update(webhook._id, { enabled }, this.org.activeOrgId).subscribe({
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

    this.notificationWebhookService.remove(id, this.org.activeOrgId).subscribe({
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
}
