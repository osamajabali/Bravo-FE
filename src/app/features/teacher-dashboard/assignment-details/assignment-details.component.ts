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
import { TranslateModule } from '@ngx-translate/core';
import { AssignmentsService } from '../../../core/services/assignment/assignments.service';
import { AssignmentDetails, StudentAssignmentDetailsResponse, StudentsAssignmentDetails, SubmissionStatus } from '../../../core/models/assignment/assignment-details.model';
import { PaginatorState } from 'primeng/paginator';

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
    DialogModule,
    TranslateModule,
  ],
  templateUrl: './assignment-details.component.html',
  styleUrl: './assignment-details.component.scss',
})
export class AssignmentDetailsComponent implements OnInit {
  sharedService = inject(SharedService);
  assignmentsService = inject(AssignmentsService);
  selectAll: boolean = false;
  showDeleteConfirmation: boolean = false;
  router = inject(Router);
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';
  assignmentDetails: AssignmentDetails = new AssignmentDetails();
  studentsAssignmentDetailsFilter: StudentsAssignmentDetails = new StudentsAssignmentDetails();
  assignmentId: number;
  submissionStatuses: SubmissionStatus[] = [];
  studentAssignmentDetails: StudentAssignmentDetailsResponse = new StudentAssignmentDetailsResponse();
  first: number = 0;

  ngOnInit(): void {
    if (this.sharedService.getPageState('studentsSubmissions')) {
      let pageNumber = this.sharedService.getPageState('studentsSubmissions');
      this.studentsAssignmentDetailsFilter.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.studentsAssignmentDetailsFilter.pageSize;
    }
    this.sharedService.pushTitle('ASSIGNMENT DETAILS');
    this.assignmentId = parseInt(localStorage.getItem('assignmentId'));
    if (this.assignmentId) {
      this.getAssignmentDetails()
    }
  }

  getAssignmentDetails() {
    this.assignmentsService.getAssignmentDetails(this.assignmentId).subscribe(res => {
      if (res.success) {
        this.submissionStatuses = res.result
      }
    })

    this.assignmentsService.getAssignmentMainDetails(this.assignmentId).subscribe(res => {
      if (res.success) {
        this.assignmentDetails = res.result
      }
    });

    this.studentsAssignmentDetailsFilter.assignmentId = this.assignmentId;
    this.getStudentAssignmentsDetails()
  }
  getStudentAssignmentsDetails() {
    this.assignmentsService.getStudentAssignmentDetails(this.studentsAssignmentDetailsFilter).subscribe(res => {
      if (res.success) {
        this.studentAssignmentDetails = res.result;
      }
    })
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

  nextPage($event: PaginatorState) {
    this.studentsAssignmentDetailsFilter.pageNumber = $event.page;
    this.sharedService.savePageState('studentsSubmissions', $event.page);
    this.first = $event.first;
    this.getStudentAssignmentsDetails();
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

  viewSubmission(submissionId: number , studentId : number): void {
    localStorage.setItem('studentId' , studentId.toString())
    localStorage.setItem('submissionId' , submissionId.toString())
    this.router.navigate([
      '/features/assignments/assignment-submission'
    ]);
  }

  onSelectAll(): void {
    // this.submissions.forEach((submission) => {
    //   submission.selected = this.selectAll;
    // });
  }

  correct(submissionId: number): void {
    // Implement correct logic
  }

  toggleActive(): void {
    // this.assignmentDetails.isEnabled = !this.assignmentDetails.isEnabled;
  }

  onSort(column: string): void {
    // Implement sorting logic for each column
    this.sortColumn = column;
    this.sortDirection =
      this.sortDirection === ''
        ? 'asc'
        : this.sortDirection === 'asc'
          ? 'desc'
          : '';
  }

  exportAs(type: 'pdf' | 'xlsx'): void {
    // Implement export logic based on type
    console.log(`Exporting as ${type}`);
  }
}
