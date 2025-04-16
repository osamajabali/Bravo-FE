import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

interface AssignmentDetails {
  grade: string;
  type: string;
  status: string;
  dueDate: Date;
  postedDate: Date;
  questionCount: number;
  section: string;
  assignedBy: string;
  avgScore: number;
  isEnabled: boolean;
}

interface StudentSubmission {
  id: number;
  studentName: string;
  initials: string;
  status: 'Active' | 'Pending';
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  timeSpent: string;
  selected?: boolean;
}

@Component({
  selector: 'app-assignment-details',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PaginationComponent,
    CheckboxModule,
    FormsModule,
    MenuModule,
    DialogModule
  ],
  templateUrl: './assignment-details.component.html',
  styleUrl: './assignment-details.component.scss'
})
export class AssignmentDetailsComponent implements OnInit {
  sharedService = inject(SharedService);
  selectAll: boolean = false;
  showDeleteConfirmation: boolean = false;
  router = inject(Router);

  assignmentDetails: AssignmentDetails = {
    grade: 'Grade 5',
    type: 'Leveled Reading',
    status: 'Active',
    dueDate: new Date('2024-03-15'),
    postedDate: new Date('2024-03-01'),
    questionCount: 10,
    section: 'Section A',
    assignedBy: 'John Doe',
    avgScore: 85,
    isEnabled: true
  };

  submissions: StudentSubmission[] = [
    {
      id: 1,
      studentName: 'John Smith',
      initials: 'JS',
      status: 'Pending',
      correctAnswers: 8,
      wrongAnswers: 2,
      score: 80,
      timeSpent: '45 min',
      selected: false
    },
    {
      id: 2,
      studentName: 'Emma Wilson',
      initials: 'EW',
      status: 'Active',
      correctAnswers: 0,
      wrongAnswers: 0,
      score: 0,
      timeSpent: '-',
      selected: false
    }
  ];

  ngOnInit(): void {
    this.sharedService.pushTitle('ASSIGNMENT DETAILS');
  }

  onResend(): void {
    // Implement resend logic
  }

  onReminder(): void {
    // Implement reminder logic
  }

  onDelete(): void {
    this.showDeleteConfirmation = true;
  }

  confirmDelete(): void {
    // Implement actual delete logic here
    console.log('Assignment deleted');
    this.showDeleteConfirmation = false;
    // Optional: Navigate back to assignments list or show success message
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }

  onEdit(): void {
    // Implement edit logic
  }

  onClose(): void {
    // Implement close logic
  }

  viewResources(): void {
    // Implement view resources logic
  }

  viewSubmission(submissionId: number): void {
    this.router.navigate(['/features/assignments/assignment-submission', submissionId]);
  }

  onSelectAll(): void {
    this.submissions.forEach(submission => {
      submission.selected = this.selectAll;
    });
  }

  correct(submissionId: number): void {
    // Implement correct logic
  }

  toggleActive(): void {
    this.assignmentDetails.isEnabled = !this.assignmentDetails.isEnabled;
  }

  onSort(column: string): void {
    // Implement sorting logic for each column
  }

  exportAs(type: 'pdf' | 'xlsx'): void {
    // Implement export logic based on type
    console.log(`Exporting as ${type}`);
  }
}
