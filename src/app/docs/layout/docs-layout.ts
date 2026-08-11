import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DOC_SECTIONS, DocSection, docSectionIndex, docSectionsByCategory } from '../docs-sections';
import { DocsCommandPalette } from '../command-palette/docs-command-palette';

/**
 * Shell for every /docs/* route — sidebar, search trigger, the active
 * topic's own router-outlet, prev/next, and the command palette overlay.
 * Replaces the old single DocsPage that rendered all 13 sections at once
 * and toggled visibility with [hidden] — each topic is now its own route,
 * so this shell is the only thing paying for content it isn't showing.
 */
@Component({
  selector: 'app-docs-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, DocsCommandPalette],
  templateUrl: './docs-layout.html',
  styleUrls: ['./docs-layout.css', '../docs-shared.css'],
})
export class DocsLayout implements OnInit {
  readonly currentYear = new Date().getFullYear();
  readonly groups = docSectionsByCategory();

  paletteOpen = false;
  currentSectionId: string | null = null;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.updateCurrentSection();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.updateCurrentSection());
  }

  private updateCurrentSection(): void {
    this.currentSectionId = this.route.firstChild?.snapshot.url[0]?.path ?? null;
  }

  get prevSection(): DocSection | null {
    if (!this.currentSectionId) return null;
    const index = docSectionIndex(this.currentSectionId);
    return index > 0 ? DOC_SECTIONS[index - 1] : null;
  }

  get nextSection(): DocSection | null {
    if (!this.currentSectionId) return null;
    const index = docSectionIndex(this.currentSectionId);
    return index >= 0 && index < DOC_SECTIONS.length - 1 ? DOC_SECTIONS[index + 1] : null;
  }

  openPalette(): void {
    this.paletteOpen = true;
  }

  closePalette(): void {
    this.paletteOpen = false;
  }

  /** ⌘K / Ctrl+K opens the palette from anywhere on any /docs page — the reflex this audience already has from every other dev tool. */
  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.paletteOpen = true;
    } else if (event.key === 'Escape') {
      this.paletteOpen = false;
    }
  }
}
