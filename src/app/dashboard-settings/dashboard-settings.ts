import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Settings } from './settings/settings';

/**
 * Page shell for the base /dashboard-settings route ("Preferences" in the
 * sidebar) — just a header plus <app-settings>, which owns all the actual
 * preferences UI including its own Save/Reset actions. Previously this
 * shell also rendered a second "Restore defaults"/"Save changes" button
 * pair below <app-settings>, wired via ViewChild to the exact same
 * methods app-settings already exposes at its own bottom — a real bug
 * (two functionally-identical button pairs), not a deliberate affordance.
 */
@Component({
  selector: 'app-dashboard-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, Settings],
  templateUrl: './dashboard-settings.html',
  styleUrl: './dashboard-settings.css',
})
export class DashboardSettings {}
