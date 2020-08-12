import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserSearchVoteInputComponent} from './user-search-vote-input.component';

describe('UserSearchVoteInputComponent', () => {
  let component: UserSearchVoteInputComponent;
  let fixture: ComponentFixture<UserSearchVoteInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSearchVoteInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchVoteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
