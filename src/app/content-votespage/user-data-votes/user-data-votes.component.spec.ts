import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserDataVotesComponent} from './user-data-votes.component';

describe('UserDataVotesComponent', () => {
  let component: UserDataVotesComponent;
  let fixture: ComponentFixture<UserDataVotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserDataVotesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDataVotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
