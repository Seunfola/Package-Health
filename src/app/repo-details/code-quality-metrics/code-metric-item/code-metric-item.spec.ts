import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeMetricItem } from './code-metric-item';

describe('CodeMetricItem', () => {
  let component: CodeMetricItem;
  let fixture: ComponentFixture<CodeMetricItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodeMetricItem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeMetricItem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
