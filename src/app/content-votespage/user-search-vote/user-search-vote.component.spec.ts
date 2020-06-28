import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserSearchVoteComponent} from './user-search-vote.component';

describe('UserSearchVoteComponent', () => {
  let component: UserSearchVoteComponent;
  let fixture: ComponentFixture<UserSearchVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSearchVoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSearchVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
