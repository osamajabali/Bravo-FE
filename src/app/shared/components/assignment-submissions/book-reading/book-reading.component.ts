import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HtmlDialogComponent } from '../../html-dialog/html-dialog.component';
import { MultipleQuestionsComponent } from '../multiple-questions/multiple-questions.component';
import { SubmissionService } from '../../../../core/services/assignment/submission.service';
import { StudentSubmission } from '../../../../core/models/assignment/student-submission.model';
import { SubmissionReadingDetails } from '../../../../core/models/assignment-submission/reading-submission-details';

@Component({
  selector: 'app-book-reading',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, HtmlDialogComponent, MultipleQuestionsComponent],
  templateUrl: './book-reading.component.html',
  styleUrl: './book-reading.component.scss',
})
export class BookReadingComponent implements OnInit {

  submissionService = inject(SubmissionService);
  showPreviewPopup: boolean = false;
  @Input() skills: any[] = [];
  @Input() submissionId: number = 0;
  @Input() readingSubmissionDetails: SubmissionReadingDetails = new SubmissionReadingDetails();
  @Input() studentId: number = 0;

  

  ngOnInit(): void {
  }

  onAudioClick() {
    console.log('Audio clicked');
  }
}
