import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightCard } from './insight-card';

describe('InsightCard', () => {
  let component: InsightCard;
  let fixture: ComponentFixture<InsightCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsightCard],
    }).compileComponents();

    fixture = TestBed.createComponent(InsightCard);
    component = fixture.componentInstance;
    component.insight = {
      title: 'Security',
      description: 'Strong score',
      value: '92',
      icon: 'assets/icons/shield.svg',
    } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
