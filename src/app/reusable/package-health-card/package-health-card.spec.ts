import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageHealthCard } from './package-health-card';

describe('PackageHealthCard', () => {
  let component: PackageHealthCard;
  let fixture: ComponentFixture<PackageHealthCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageHealthCard],
    }).compileComponents();

    fixture = TestBed.createComponent(PackageHealthCard);
    component = fixture.componentInstance;
    component.feature = {
      title: 'Security',
      description: 'Dependency checks and alerts',
      icon: 'assets/icons/shield.svg',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
