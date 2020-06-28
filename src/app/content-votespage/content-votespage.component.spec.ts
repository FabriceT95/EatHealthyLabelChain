import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContentVotespageComponent} from './content-votespage.component';

describe('ContentVotespageComponent', () => {
  let component: ContentVotespageComponent;
  let fixture: ComponentFixture<ContentVotespageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentVotespageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentVotespageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
