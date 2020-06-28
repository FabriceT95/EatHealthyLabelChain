import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserFormVoteComponent} from './user-form-vote.component';

describe('UserFormVoteComponent', () => {
  let component: UserFormVoteComponent;
  let fixture: ComponentFixture<UserFormVoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserFormVoteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormVoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
