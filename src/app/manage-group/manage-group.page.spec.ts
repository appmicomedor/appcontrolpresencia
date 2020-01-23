import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageGroupPage } from './manage-group.page';

describe('ManageGroupPage', () => {
  let component: ManageGroupPage;
  let fixture: ComponentFixture<ManageGroupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageGroupPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageGroupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
