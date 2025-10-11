import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsItem } from './settings-item';

describe('SettingsItem', () => {
  let component: SettingsItem;
  let fixture: ComponentFixture<SettingsItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
