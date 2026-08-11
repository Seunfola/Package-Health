import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { OrganizationSettings } from './organization';

describe('OrganizationSettings', () => {
  let component: OrganizationSettings;
  let fixture: ComponentFixture<OrganizationSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationSettings],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizationSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
