import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  SupplierRequestService,
  SupplierRequest,
} from '../../../service/order/supplier-request.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface SurveyData {
  requestId: number;
  product_id: number;
  supplier_id: number;
  warehouse_id: number;
  quantity: number;
  status: string;
  is_defective: boolean;
  quality: number;
  comments: string;
}

@Component({
  selector: 'app-supplier-req-survey',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule, // Make sure RouterModule is imported
  ],
  providers: [
    SupplierRequestService,
  ],
  templateUrl: './supplier-req-survey.component.html',
  styleUrls: ['./supplier-req-survey.component.css'],
})
export class SupplierReqSurveyComponent implements OnInit {
  requestId!: number;
  request: SupplierRequest | null = null;
  surveyForm!: FormGroup;
  isLoading = true;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';
  isSurveyVisible = false;

  statusOptions = [
    { value: 'received', label: 'Received' },
    { value: 'returned', label: 'Returned' },
  ];

  questions = [
    'How is the quality of the goods?',
    'Any Issues/ Noticable Defects?',
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private supplierRequestService: SupplierRequestService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.route.params.subscribe((params) => {
      this.requestId = +params['id']; // Convert to number with '+'
      this.loadRequestDetails();
    });
  }

  private initializeForm(): void {
    this.surveyForm = this.fb.group({
      status: ['received', Validators.required],
      question1: [
        null, // Start with no selection to force user choice
        [Validators.required, Validators.min(1), Validators.max(10)],
      ],
      question2: [null, Validators.required], // Start with no selection
      comments: ['', Validators.required],
    });
  }

  private loadRequestDetails(): void {
    this.isLoading = true;

    // Get all requests and then filter for the one we need
    this.supplierRequestService.getAllRequests().subscribe({
      next: (requests) => {
        this.request =
          requests.find((req) => req.request_id === this.requestId) || null;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching request details:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to load request details. Please try again.';
        this.submitError = true;
      },
    });
  }

  getRatingLabel(value: number): string {
    // Expanded labels for 1-10 scale
    const labels = [
      'Very Poor', // 1
      'Poor', // 2
      'Below Average', // 3
      'Slightly Below Average', // 4
      'Average', // 5
      'Slightly Above Average', // 6
      'Above Average', // 7
      'Good', // 8
      'Very Good', // 9
      'Excellent', // 10
    ];
    return labels[value - 1] || '';
  }

  onSubmit(): void {
    if (this.surveyForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.surveyForm.controls).forEach((key) => {
        const control = this.surveyForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    if (!this.request) {
      this.errorMessage = 'Cannot submit without request details';
      this.submitError = true;
      return;
    }

    const formValues = this.surveyForm.value;

    // Format the data according to API requirements
    const surveyData: SurveyData = {
      requestId: this.requestId,
      product_id: this.request.product_id || 1, // Fallback if not available
      supplier_id: this.request.supplier_id || 101, // Fallback if not available
      warehouse_id: this.request.warehouse_id,
      quantity: this.request.count,
      status: formValues.status,
      is_defective: formValues.question2, // boolean value - true means defective
      quality: formValues.question1, // 1-10 rating
      comments: formValues.comments,
    };

    // Show loading state
    this.isLoading = true;
    this.submitSuccess = false;
    this.submitError = false;

    // Make the actual API call
    this.supplierRequestService.markDeliveryReceived(surveyData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.submitSuccess = true;
          // Redirect after successful submission
          setTimeout(() => {
            this.router.navigate(['/dashboard/warehouse/supplier-requests']);
          }, 2000);
        } else {
          this.submitError = true;
          this.errorMessage = response.message;
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.submitError = true;
        this.errorMessage =
          'Failed to update delivery status. Please try again.';
        console.error('Error submitting form:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/warehouse/supplier-requests']);
  }

  getTotalPrice(): number {
    return this.request ? this.request.count * this.request.unit_price : 0;
  }

  toggleSurveyVisibility(): void {
    this.isSurveyVisible = !this.isSurveyVisible;
  }
}
