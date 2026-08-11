import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-doc-organizations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './organizations.html',
  styleUrls: ['../../docs-shared.css'],
  host: { class: 'docs-section glass-panel' },
})
export class DocOrganizations {}
