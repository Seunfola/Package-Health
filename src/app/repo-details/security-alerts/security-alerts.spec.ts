import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAlerts } from './security-alerts';

describe('SecurityAlerts', () => {
  let component: SecurityAlerts;
  let fixture: ComponentFixture<SecurityAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityAlerts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityAlerts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
