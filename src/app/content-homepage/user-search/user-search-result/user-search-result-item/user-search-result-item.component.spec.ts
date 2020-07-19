import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSearchResultItemComponent } from './user-search-result-item.component';

describe('UserSearchResultItemComponent', () => {
  let component: UserSearchResultItemComponent;
  let fixture: ComponentFixture<UserSearchResultItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSearchResultItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchResultItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
