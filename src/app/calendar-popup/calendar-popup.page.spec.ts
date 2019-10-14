import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarPopupPage } from './calendar-popup.page';

describe('CalendarPopupPage', () => {
  let component: CalendarPopupPage;
  let fixture: ComponentFixture<CalendarPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarPopupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
