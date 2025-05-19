import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckAssignComponent } from './truck-assign.component';

describe('TruckAssignComponent', () => {
  let component: TruckAssignComponent;
  let fixture: ComponentFixture<TruckAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TruckAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TruckAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
