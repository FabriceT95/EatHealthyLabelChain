import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserResultVoteComponent} from './user-result-vote.component';

describe('UserResultVoteComponent', () => {
  let component: UserResultVoteComponent;
  let fixture: ComponentFixture<UserResultVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserResultVoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResultVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
