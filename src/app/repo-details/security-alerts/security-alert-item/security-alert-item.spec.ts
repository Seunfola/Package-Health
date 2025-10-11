import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityAlertItem } from './security-alert-item';

describe('SecurityAlertItem', () => {
  let component: SecurityAlertItem;
  let fixture: ComponentFixture<SecurityAlertItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityAlertItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityAlertItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
