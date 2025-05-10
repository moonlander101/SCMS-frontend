import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverManagerRegisterComponent } from './driver-manager-register.component';

describe('DriverManagerRegisterComponent', () => {
  let component: DriverManagerRegisterComponent;
  let fixture: ComponentFixture<DriverManagerRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverManagerRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverManagerRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
