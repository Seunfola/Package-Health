import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMcpServer } from './mcp-server';

describe('DocMcpServer', () => {
  let component: DocMcpServer;
  let fixture: ComponentFixture<DocMcpServer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocMcpServer],
    }).compileComponents();

    fixture = TestBed.createComponent(DocMcpServer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
