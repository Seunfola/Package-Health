import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { GatekeeperSettings } from './gatekeeper';

describe('GatekeeperSettings', () => {
  let component: GatekeeperSettings;
  let fixture: ComponentFixture<GatekeeperSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GatekeeperSettings],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(GatekeeperSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
