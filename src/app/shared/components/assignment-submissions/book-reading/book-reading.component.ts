import { Component, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HtmlDialogComponent } from '../../html-dialog/html-dialog.component';
import { MultipleQuestionsComponent } from '../multiple-questions/multiple-questions.component';
import { SubmissionService } from '../../../../core/services/assignment/submission.service';
import { StudentSubmission } from '../../../../core/models/assignment/student-submission.model';
import { QuestionsSubmissions, SubmissionReadingDetails } from '../../../../core/models/assignment-submission/reading-submission-details';
import { SkillData } from '../../../../core/models/assignment-submission/assignment-submission-1uestion.model';

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
  @Input() submissionId: number = 0;
  @Input() readingSubmissionDetails: SubmissionReadingDetails = new SubmissionReadingDetails();
  @Input() studentId: number = 0;
  skills = signal<SkillData>(new SkillData);

  

  ngOnInit(): void {
    if (localStorage.getItem('submissionId') && localStorage.getItem('studentId')) {
      this.submissionId = parseInt(localStorage.getItem('submissionId'));
      this.getReadingQuestions()
    }
  }

  getReadingQuestions() {
    this.submissionService.getQuestionsSubmissionDetails(this.submissionId).subscribe(res =>{
      if(res.success){
        this.skills.set(res.result);
      }
    })
  }

  onAudioClick() {
    console.log('Audio clicked');
  }
}
