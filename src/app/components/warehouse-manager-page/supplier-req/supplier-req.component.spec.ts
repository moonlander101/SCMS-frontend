import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierReqComponent } from './supplier-req.component';

describe('SupplierReqComponent', () => {
  let component: SupplierReqComponent;
  let fixture: ComponentFixture<SupplierReqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierReqComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierReqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
