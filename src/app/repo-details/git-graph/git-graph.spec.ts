import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributionGraph } from './git-graph';

describe('ContributionGraph', () => {
  let component: ContributionGraph;
  let fixture: ComponentFixture<ContributionGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContributionGraph],
    }).compileComponents();

    fixture = TestBed.createComponent(ContributionGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
