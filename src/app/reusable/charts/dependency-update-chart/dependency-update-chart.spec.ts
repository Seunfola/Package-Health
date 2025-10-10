import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependencyUpdateChart } from './dependency-update-chart';

describe('DependencyUpdateChart', () => {
  let component: DependencyUpdateChart;
  let fixture: ComponentFixture<DependencyUpdateChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DependencyUpdateChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DependencyUpdateChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
