import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoDetailsDash } from './repo-details-dash';

describe('RepoDetailsDash', () => {
  let component: RepoDetailsDash;
  let fixture: ComponentFixture<RepoDetailsDash>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoDetailsDash]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoDetailsDash);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
