import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserSearchVoteFilterComponent} from './user-search-vote-filter.component';

describe('UserSearchVoteFilterComponent', () => {
  let component: UserSearchVoteFilterComponent;
  let fixture: ComponentFixture<UserSearchVoteFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSearchVoteFilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchVoteFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
