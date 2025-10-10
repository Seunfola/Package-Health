import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueResolutionChart } from './issue-resolution-chart';

describe('IssueResolutionChart', () => {
  let component: IssueResolutionChart;
  let fixture: ComponentFixture<IssueResolutionChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueResolutionChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueResolutionChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
