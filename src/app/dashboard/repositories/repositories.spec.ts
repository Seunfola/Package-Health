import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DashboardRepositories } from './repositories';

describe('DashboardRepositories', () => {
  let component: DashboardRepositories;
  let fixture: ComponentFixture<DashboardRepositories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRepositories],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardRepositories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
