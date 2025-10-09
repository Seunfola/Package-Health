import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoHealth } from './repo-health';

describe('RepoHealth', () => {
  let component: RepoHealth;
  let fixture: ComponentFixture<RepoHealth>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoHealth]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepoHealth);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
