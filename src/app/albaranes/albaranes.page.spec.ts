import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbaranesPage } from './albaranes.page';

describe('AlbaranesPage', () => {
  let component: AlbaranesPage;
  let fixture: ComponentFixture<AlbaranesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlbaranesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbaranesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
