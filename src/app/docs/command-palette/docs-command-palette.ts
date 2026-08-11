import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DOC_SECTIONS, DocSection } from '../docs-sections';

/**
 * ⌘K-style instant search over every doc topic. This is the actual answer
 * to "too much to scroll through" — not pagination, which just relocates
 * the same problem into numbered chunks. A developer-tool audience expects
 * this exact interaction (Stripe, Vercel, Linear) and it's faster than any
 * amount of clicking through a sidebar or a page-2/page-3 control.
 */
@Component({
  selector: 'app-docs-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docs-command-palette.html',
  styleUrl: './docs-command-palette.css',
})
export class DocsCommandPalette implements AfterViewInit {
  @Output() closed = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  query = '';
  activeIndex = 0;

  constructor(private readonly router: Router) {}

  ngAfterViewInit(): void {
    // Opened via a click or ⌘K, either way the whole point is to start typing immediately.
    this.searchInput?.nativeElement.focus();
  }

  get results(): DocSection[] {
    const term = this.query.trim().toLowerCase();
    if (!term) return DOC_SECTIONS;
    return DOC_SECTIONS.filter(
      (s) => s.title.toLowerCase().includes(term) || s.description.toLowerCase().includes(term) || s.keywords.includes(term),
    );
  }

  onQueryChange(): void {
    this.activeIndex = 0;
  }

  moveDown(): void {
    if (this.results.length === 0) return;
    this.activeIndex = (this.activeIndex + 1) % this.results.length;
  }

  moveUp(): void {
    if (this.results.length === 0) return;
    this.activeIndex = (this.activeIndex - 1 + this.results.length) % this.results.length;
  }

  selectActive(): void {
    const section = this.results[this.activeIndex];
    if (section) this.go(section);
  }

  go(section: DocSection): void {
    this.router.navigate(['/docs', section.id]);
    this.close();
  }

  close(): void {
    this.closed.emit();
  }
}
