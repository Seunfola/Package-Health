import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocGithubActions } from './github-actions';

describe('DocGithubActions', () => {
  let component: DocGithubActions;
  let fixture: ComponentFixture<DocGithubActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocGithubActions],
    }).compileComponents();

    fixture = TestBed.createComponent(DocGithubActions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
