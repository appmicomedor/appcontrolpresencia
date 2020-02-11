import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadViewPage } from './upload-view.page';

describe('UploadViewPage', () => {
  let component: UploadViewPage;
  let fixture: ComponentFixture<UploadViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadViewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
