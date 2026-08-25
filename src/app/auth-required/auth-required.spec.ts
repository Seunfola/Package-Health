import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';

import { AuthRequiredPage } from './auth-required';

describe('AuthRequiredPage', () => {
  let component: AuthRequiredPage;
  let fixture: ComponentFixture<AuthRequiredPage>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthRequiredPage],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthRequiredPage);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the sign-in prompt copy', () => {
    const rendered = fixture.nativeElement as HTMLElement;
    expect(rendered.textContent).toContain('Sign in to continue');
    expect(rendered.textContent).toContain('This page is only available to signed-in users');
  });

  it('continue() opens the login modal', () => {
    expect(component.showLoginModal).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-auth-login')).toBeNull();

    component.continue();
    fixture.detectChanges();

    expect(component.showLoginModal).toBeTrue();
    expect(fixture.nativeElement.querySelector('app-auth-login')).not.toBeNull();
  });

  it('closeLoginModal() closes the modal', () => {
    component.continue();
    fixture.detectChanges();
    expect(component.showLoginModal).toBeTrue();

    component.closeLoginModal();
    fixture.detectChanges();

    expect(component.showLoginModal).toBeFalse();
    expect(fixture.nativeElement.querySelector('app-auth-login')).toBeNull();
  });

  it('goBack() calls window.history.back() when in-app history exists', () => {
    spyOnProperty(window.history, 'length').and.returnValue(2);
    const backSpy = spyOn(window.history, 'back');
    const navigateSpy = spyOn(router, 'navigate');

    component.goBack();

    expect(backSpy).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('goBack() falls back to /home when there is no in-app history', () => {
    spyOnProperty(window.history, 'length').and.returnValue(1);
    const backSpy = spyOn(window.history, 'back');
    const navigateSpy = spyOn(router, 'navigate');

    component.goBack();

    expect(backSpy).not.toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });
});
