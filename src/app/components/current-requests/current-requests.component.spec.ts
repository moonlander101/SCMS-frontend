import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentRequestsComponent } from './current-requests.component';

describe('CurrentRequestsComponent', () => {
  let component: CurrentRequestsComponent;
  let fixture: ComponentFixture<CurrentRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
