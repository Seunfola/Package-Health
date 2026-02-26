import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { RepoDetails } from './repo-details';

describe('RepoDetails', () => {
  let component: RepoDetails;
  let fixture: ComponentFixture<RepoDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepoDetails],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RepoDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
