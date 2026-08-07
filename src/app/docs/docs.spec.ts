import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsPage } from './docs';

describe('DocsPage', () => {
  let component: DocsPage;
  let fixture: ComponentFixture<DocsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows every section when the search box is empty', () => {
    component.searchTerm = '';
    for (const section of component.sections) {
      expect(component.isVisible(section.id)).toBeTrue();
    }
    expect(component.noResults).toBeFalse();
  });

  it('filters to only matching sections when searching', () => {
    component.searchTerm = 'claude';
    expect(component.isVisible('mcp-server')).toBeTrue();
    expect(component.isVisible('cli')).toBeFalse();
    expect(component.noResults).toBeFalse();
  });

  it('reports no results for a term nothing matches', () => {
    component.searchTerm = 'xyzzy-nonexistent';
    expect(component.noResults).toBeTrue();
  });
});
