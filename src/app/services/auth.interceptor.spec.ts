import { TestBed } from '@angular/core/testing';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
  HttpClient,
} from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';

import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { environment } from '@/environments/environment';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['getToken', 'logout']);
    authService.getToken.and.returnValue('test-token');

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authService },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('attaches the Authorization header to GET auth/me (the OAuth-login-follow-up call)', () => {
    httpClient.get(`${environment.authUrl}/me`).subscribe();

    const req = httpMock.expectOne(`${environment.authUrl}/me`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('attaches the Authorization header to apiBaseUrl requests', () => {
    httpClient.get(`${environment.apiBaseUrl}/repos`).subscribe();

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/repos`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('attaches the Authorization header to apiUrl (v1) requests', () => {
    httpClient.get(`${environment.apiUrl}/scan/npm/express`).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/scan/npm/express`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush({});
  });

  it('does NOT attach the Authorization header to external URLs', () => {
    httpClient.get('https://api.github.com/user').subscribe();

    const req = httpMock.expectOne('https://api.github.com/user');
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush({});
  });
});
