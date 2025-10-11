import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsInput } from './settings-input';

describe('SettingsInput', () => {
  let component: SettingsInput;
  let fixture: ComponentFixture<SettingsInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
