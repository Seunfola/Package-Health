import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GitGraph } from './git-graph';

describe('GitGraph', () => {
  let component: GitGraph;
  let fixture: ComponentFixture<GitGraph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GitGraph]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GitGraph);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
