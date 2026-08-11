import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsLayout } from './docs-layout';

describe('DocsLayout', () => {
  let component: DocsLayout;
  let fixture: ComponentFixture<DocsLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the palette on ctrl+k', () => {
    expect(component.paletteOpen).toBe(false);
    component.onKeydown(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
    expect(component.paletteOpen).toBe(true);
  });

  it('closes the palette on escape', () => {
    component.paletteOpen = true;
    component.onKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(component.paletteOpen).toBe(false);
  });
});
