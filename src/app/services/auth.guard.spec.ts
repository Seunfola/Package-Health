import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router, UrlTree } from '@angular/router';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { authGuard } from './auth.guard';
import { PENDING_RETURN_URL_KEY } from '../auth-required/auth-required';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let router: Router;

  const runGuard = (url: string) =>
    TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        { url } as RouterStateSnapshot,
      ),
    );

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideRouter([])],
    });
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('allows navigation through when the visitor is authenticated', () => {
    spyOn(TestBed.inject(AuthService), 'isAuthenticated').and.returnValue(true);

    const result = runGuard('/dashboard');

    expect(result).toBeTrue();
    expect(sessionStorage.getItem(PENDING_RETURN_URL_KEY)).toBeNull();
  });

  it('redirects an unauthenticated visitor to /auth-required and stashes the attempted URL', () => {
    spyOn(TestBed.inject(AuthService), 'isAuthenticated').and.returnValue(false);
    const createUrlTreeSpy = spyOn(router, 'createUrlTree').and.callThrough();

    const result = runGuard('/dashboard/repo-health');

    expect(sessionStorage.getItem(PENDING_RETURN_URL_KEY)).toBe('/dashboard/repo-health');
    expect(createUrlTreeSpy).toHaveBeenCalledWith(['/auth-required']);
    expect(result instanceof UrlTree).toBeTrue();
  });
});
