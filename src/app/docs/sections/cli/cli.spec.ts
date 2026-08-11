import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocCli } from './cli';

describe('DocCli', () => {
  let component: DocCli;
  let fixture: ComponentFixture<DocCli>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocCli],
    }).compileComponents();

    fixture = TestBed.createComponent(DocCli);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
