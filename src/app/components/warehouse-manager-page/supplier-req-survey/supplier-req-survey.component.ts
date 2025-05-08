import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  SupplierRequestService,
  SupplierRequest,
} from '../../../service/order/supplier-request.service';

interface SurveyData {
  requestId: number;
  status: 'accepted' | 'received' | 'returned' | 'rejected';
  surveyResponses: {
    question1: number;
    question2: number;
    question3: number;
    question4: number;
    question5: number;
  };
  comments: string;
}

@Component({
  selector: 'app-supplier-req-survey',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
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
    'How would you rate the quality of the delivered products?',
    'How well did the delivery meet the expected timeline?',
    'Was the product packaging in good condition?',
    'Did the products meet the specifications requested?',
    'How likely are you to order from this supplier again?',
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
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      question2: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      question3: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      question4: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      question5: [
        3,
        [Validators.required, Validators.min(1), Validators.max(5)],
      ],
      comments: [''],
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
    const labels = ['Poor', 'Fair', 'Average', 'Good', 'Excellent'];
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

    const formValues = this.surveyForm.value;

    const surveyData: SurveyData = {
      requestId: this.requestId,
      status: formValues.status,
      surveyResponses: {
        question1: formValues.question1,
        question2: formValues.question2,
        question3: formValues.question3,
        question4: formValues.question4,
        question5: formValues.question5,
      },
      comments: formValues.comments,
    };

    // Log the data that would be sent to the backend
    console.log('Submitting survey data:', surveyData);

    // Show success message
    this.submitSuccess = true;

    // Redirect after successful submission - FIXED PATH
    setTimeout(() => {
      this.router.navigate(['/dashboard/warehouse/supplier-requests']);
    }, 2000);
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
