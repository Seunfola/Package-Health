import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitActivityChart } from './commit-activity-chart';

describe('CommitActivityChart', () => {
  let component: CommitActivityChart;
  let fixture: ComponentFixture<CommitActivityChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommitActivityChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommitActivityChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
