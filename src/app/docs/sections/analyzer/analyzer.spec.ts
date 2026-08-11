import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocAnalyzer } from './analyzer';

describe('DocAnalyzer', () => {
  let component: DocAnalyzer;
  let fixture: ComponentFixture<DocAnalyzer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocAnalyzer],
    }).compileComponents();

    fixture = TestBed.createComponent(DocAnalyzer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
