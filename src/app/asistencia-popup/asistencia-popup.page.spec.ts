import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaPopupPage } from './asistencia-popup.page';

describe('AsistenciaPopupPage', () => {
  let component: AsistenciaPopupPage;
  let fixture: ComponentFixture<AsistenciaPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistenciaPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
