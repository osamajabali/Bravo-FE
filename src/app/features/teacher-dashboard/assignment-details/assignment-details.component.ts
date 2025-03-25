import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

interface AssignmentDetails {
  grade: string;
  type: string;
  status: string;
  dueDate: Date;
  postedDate: Date;
  questionCount: number;
  skillName: string;
  avgScore: number;
  sentTo: string;
}

interface StudentSubmission {
  id: number;
  studentName: string;
  initials: string;
  status: 'Pending' | 'Submitted';
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
    FormsModule
  ],
  templateUrl: './assignment-details.component.html',
  styleUrl: './assignment-details.component.scss'
})
export class AssignmentDetailsComponent implements OnInit {
  sharedService = inject(SharedService);
  selectAll: boolean = false;

  assignmentDetails: AssignmentDetails = {
    grade: 'Grade 5',
    type: 'Skill',
    status: 'Active',
    dueDate: new Date('2024-03-15'),
    postedDate: new Date('2024-03-01'),
    questionCount: 10,
    skillName: 'Reading Comprehension',
    avgScore: 85,
    sentTo: 'Class A'
  };

  submissions: StudentSubmission[] = [
    {
      id: 1,
      studentName: 'John Smith',
      initials: 'JS',
      status: 'Submitted',
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
      status: 'Pending',
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
    // Implement delete logic
  }

  onEdit(): void {
    // Implement edit logic
  }

  onClose(): void {
    // Implement close logic
  }

  viewSubmission(submissionId: number): void {
    // Implement view submission logic
  }

  onSelectAll(): void {
    this.submissions.forEach(submission => {
      submission.selected = this.selectAll;
    });
  }

  onSort(column: string): void {
    // Implement sorting logic for each column
  }
}
