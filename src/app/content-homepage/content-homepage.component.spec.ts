import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentHomepageComponent } from './content-homepage.component';

describe('ContentHomepageComponent', () => {
  let component: ContentHomepageComponent;
  let fixture: ComponentFixture<ContentHomepageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentHomepageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentHomepageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
