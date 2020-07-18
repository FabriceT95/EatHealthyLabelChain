import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserProposalItemComponent} from './user-proposal-item.component';

describe('UserProposalItemComponent', () => {
  let component: UserProposalItemComponent;
  let fixture: ComponentFixture<UserProposalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserProposalItemComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserProposalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
