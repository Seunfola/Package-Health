import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { docSectionsByCategory } from '../docs-sections';

/**
 * /docs itself — a real landing page now, not just "the top of the
 * scroll." Every topic below routes to its own /docs/:id page.
 */
@Component({
  selector: 'app-docs-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './docs-overview.html',
  styleUrls: ['./docs-overview.css', '../docs-shared.css'],
})
export class DocsOverview {
  readonly groups = docSectionsByCategory();
}
