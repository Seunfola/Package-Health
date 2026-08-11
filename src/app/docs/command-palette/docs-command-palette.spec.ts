import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsCommandPalette } from './docs-command-palette';

describe('DocsCommandPalette', () => {
  let component: DocsCommandPalette;
  let fixture: ComponentFixture<DocsCommandPalette>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsCommandPalette],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsCommandPalette);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows all sections with an empty query', () => {
    expect(component.results.length).toBeGreaterThan(10);
  });

  it('filters by title', () => {
    component.query = 'quick start';
    expect(component.results.length).toBe(1);
    expect(component.results[0].id).toBe('quick-start');
  });

  it('wraps around when moving down past the last result', () => {
    component.activeIndex = component.results.length - 1;
    component.moveDown();
    expect(component.activeIndex).toBe(0);
  });

  it('wraps around when moving up past the first result', () => {
    component.activeIndex = 0;
    component.moveUp();
    expect(component.activeIndex).toBe(component.results.length - 1);
  });

  it('emits closed when close() is called', () => {
    let emitted = false;
    component.closed.subscribe(() => (emitted = true));
    component.close();
    expect(emitted).toBe(true);
  });
});
