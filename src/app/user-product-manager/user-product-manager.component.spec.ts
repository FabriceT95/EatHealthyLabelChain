import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProductManagerComponent } from './user-product-manager.component';

describe('UserProductManagerComponent', () => {
  let component: UserProductManagerComponent;
  let fixture: ComponentFixture<UserProductManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserProductManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProductManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
