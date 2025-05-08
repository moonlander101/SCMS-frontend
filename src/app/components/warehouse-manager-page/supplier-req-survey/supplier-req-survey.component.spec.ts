import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierReqSurveyComponent } from './supplier-req-survey.component';

describe('SupplierReqSurveyComponent', () => {
  let component: SupplierReqSurveyComponent;
  let fixture: ComponentFixture<SupplierReqSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierReqSurveyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierReqSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
