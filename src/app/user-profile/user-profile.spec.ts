import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [UserProfile],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reject invalid github username', () => {
    component.githubUsername = 'bad username';

    component.linkGithub();

    expect(component.statusType).toBe('error');
    expect(component.statusMessage).toContain('Invalid GitHub username');
  });

  it('should export profile data as a downloadable JSON file', () => {
    component.userName = 'Test User';
    component.userEmail = 'test@example.com';

    const clickSpy = jasmine.createSpy('click');
    spyOn(document, 'createElement').and.returnValue({ click: clickSpy } as unknown as HTMLAnchorElement);
    spyOn(URL, 'createObjectURL').and.returnValue('blob:mock');
    spyOn(URL, 'revokeObjectURL');

    component.exportProfileFile();

    expect(clickSpy).toHaveBeenCalled();
  });
});
