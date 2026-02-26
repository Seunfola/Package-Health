import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { DashboardSettings } from './dashboard-settings';

describe('DashboardSettings', () => {
  let component: DashboardSettings;
  let fixture: ComponentFixture<DashboardSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSettings],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
