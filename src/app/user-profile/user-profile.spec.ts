import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfile } from './user-profile';

describe('UserProfile', () => {
  let component: UserProfile;
  let fixture: ComponentFixture<UserProfile>;

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [UserProfile],
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

  it('should save profile data to localStorage', () => {
    component.userName = 'Test User';
    component.userEmail = 'test@example.com';

    component.saveProfile();

    const saved = localStorage.getItem('package_health_user_profile');
    expect(saved).toBeTruthy();
    expect(saved).toContain('Test User');
  });

  it('should parse resume content and extract key fields', () => {
    const text = [
      'Jane Doe',
      'Senior Angular Engineer',
      'jane@example.com',
      'https://github.com/janedoe',
      'https://www.linkedin.com/in/janedoe',
      '+1 (555) 123-4567',
      'Remote USA',
      'Experienced in Angular, TypeScript, Node.js, Docker.',
    ].join('\n');

    (component as any).applyParsedResumeData(text);

    expect(component.userEmail).toBe('jane@example.com');
    expect(component.githubUsername).toBe('janedoe');
    expect(component.linkedinProfileUrl).toContain('linkedin.com');
    expect(component.phoneNumber).toContain('555');
    expect(component.skills).toContain('Angular');
  });
});
