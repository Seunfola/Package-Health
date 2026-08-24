import { Component, input } from '@angular/core';

/**
 * The one loading-placeholder primitive for the authenticated app —
 * composes the global `.skeleton-block` shimmer (styles.css) with
 * caller-supplied dimensions instead of every page hand-rolling its own
 * <div class="skeleton-whatever"> (previously: repo-health's `.skeleton__*`,
 * notification's `.notification-skeleton`, and plain "Loading…" text
 * elsewhere — three different mechanisms for the same idea).
 *
 * Usage: stack `<app-skeleton>` instances shaped like the real content
 * they stand in for (a stat tile, a table row, a paragraph line) — same
 * approach repo-health already used by hand, just reusable now. This
 * deliberately does NOT try to infer a layout from a "type" input; the
 * caller's own template already knows the real shape best.
 */
@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <span
      class="skeleton-block"
      aria-hidden="true"
      [style.width]="circle() ? height() : width()"
      [style.height]="height()"
      [style.border-radius]="circle() ? '50%' : radius()"
    ></span>
  `,
  styles: [
    `
      :host {
        display: block;
        line-height: 0;
      }
    `,
  ],
})
export class Skeleton {
  /** CSS width. Defaults to filling the parent — most callers sit inside a flex/grid cell that already constrains width. */
  readonly width = input('100%');
  /** CSS height — the one dimension almost every caller sets explicitly. */
  readonly height = input('1rem');
  /** Corner radius when not a circle. */
  readonly radius = input('8px');
  /** Forces a circle (width = height, radius 50%) — avatars, status dots. */
  readonly circle = input(false);
}
