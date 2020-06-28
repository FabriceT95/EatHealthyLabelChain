import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FormInputProductComponent} from './form-input-product.component';

describe('FormInputProductComponent', () => {
  let component: FormInputProductComponent;
  let fixture: ComponentFixture<FormInputProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormInputProductComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInputProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
