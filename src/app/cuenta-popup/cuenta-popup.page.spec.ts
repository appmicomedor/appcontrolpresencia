import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaPopupPage } from './cuenta-popup.page';

describe('CuentaPopupPage', () => {
  let component: CuentaPopupPage;
  let fixture: ComponentFixture<CuentaPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CuentaPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
