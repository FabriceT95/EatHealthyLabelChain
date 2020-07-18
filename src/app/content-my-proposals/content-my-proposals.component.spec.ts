import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContentMyProposalsComponent} from './content-my-proposals.component';

describe('ContentMyProposalsComponent', () => {
  let component: ContentMyProposalsComponent;
  let fixture: ComponentFixture<ContentMyProposalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentMyProposalsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentMyProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
