import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { Directory } from './directory';
import { environment } from '@/environments/environment';

describe('Directory', () => {
  let component: Directory;
  let fixture: ComponentFixture<Directory>;
  let httpMock: HttpTestingController;

  const profile = (username: string) => ({
    username,
    name: username,
    bio: 'hi',
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Directory, HttpClientTestingModule],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Directory);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads the first page of profiles on init', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(
      (r) => r.url === `${environment.apiBaseUrl}/profile` && r.params.get('limit') === '20',
    );
    expect(req.request.params.has('after')).toBe(false);
    req.flush([profile('alice'), profile('bob')]);

    expect(component.profiles.length).toBe(2);
    expect(component.isLoading).toBe(false);
  });

  it('never renders an email field, even if one somehow appeared in the response', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne((r) => r.url === `${environment.apiBaseUrl}/profile`);
    req.flush([{ ...profile('alice'), email: 'alice@example.com' } as any]);

    fixture.detectChanges();
    const rendered = fixture.nativeElement as HTMLElement;
    expect(rendered.textContent).not.toContain('alice@example.com');
  });

  it('pages forward using the last-loaded username as the `after` cursor', () => {
    fixture.detectChanges();
    const first = httpMock.expectOne((r) => r.url === `${environment.apiBaseUrl}/profile`);
    // A full page (20) signals there may be more.
    const fullPage = Array.from({ length: 20 }, (_, i) => profile(`user${i}`));
    first.flush(fullPage);

    expect(component.hasMore).toBe(true);

    component.loadMore();
    const second = httpMock.expectOne(
      (r) => r.url === `${environment.apiBaseUrl}/profile` && r.params.get('after') === 'user19',
    );
    second.flush([profile('user20')]);

    expect(component.profiles.length).toBe(21);
    expect(component.hasMore).toBe(false);
  });
});
