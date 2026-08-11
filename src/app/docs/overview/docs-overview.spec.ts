import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocsOverview } from './docs-overview';

describe('DocsOverview', () => {
  let component: DocsOverview;
  let fixture: ComponentFixture<DocsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocsOverview],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocsOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
