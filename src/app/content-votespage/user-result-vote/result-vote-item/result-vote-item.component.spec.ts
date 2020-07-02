import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultVoteItemComponent } from './result-vote-item.component';

describe('ResultVoteItemComponent', () => {
  let component: ResultVoteItemComponent;
  let fixture: ComponentFixture<ResultVoteItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultVoteItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultVoteItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
