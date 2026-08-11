import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DashboardLeakScans } from './leak-scans';

describe('DashboardLeakScans', () => {
  let component: DashboardLeakScans;
  let fixture: ComponentFixture<DashboardLeakScans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLeakScans],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLeakScans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
