import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DocPrivacy } from './privacy';

describe('DocPrivacy', () => {
  let component: DocPrivacy;
  let fixture: ComponentFixture<DocPrivacy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocPrivacy],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DocPrivacy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
