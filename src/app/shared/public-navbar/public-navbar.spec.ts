import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PublicNavbar } from './public-navbar';

describe('PublicNavbar', () => {
  let component: PublicNavbar;
  let fixture: ComponentFixture<PublicNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicNavbar],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PublicNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the login modal from both "Log in" and "Get Started"', () => {
    expect(component.showLoginModal).toBeFalse();
    component.openLoginModal();
    expect(component.showLoginModal).toBeTrue();
    component.closeLoginModal();
    expect(component.showLoginModal).toBeFalse();
  });
});
