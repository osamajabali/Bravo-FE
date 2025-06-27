import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { SubmissionService } from '../../../core/services/assignment/submission.service';
import {
  StudentSubmission,
  SubmissionQuestion,
} from '../../../core/models/assignment/student-submission.model';
import { MultipleQuestionsComponent } from '../../../shared/components/assignment-submissions/multiple-questions/multiple-questions.component';
import { BookReadingComponent } from '../../../shared/components/assignment-submissions/book-reading/book-reading.component';
import { BookPageSummaryRecordingComponent } from '../../../shared/components/assignment-submissions/book-page-summary-recording/book-page-summary-recording.component';
import { StudentMarkingDrawerComponent } from '../../../shared/components/student-marking-drawer/student-marking-drawer.component';
import { BookListeningComponent } from '../../../shared/components/assignment-submissions/book-listening/book-listening.component';
import { QuestionAnswerComponent } from '../../../shared/components/assignment-submissions/question-answer/question-answer.component';

enum SubmissionType {
  MULTIPLE_QUESTIONS = 'multiple-questions',
  BOOK_READING = 'book-reading',
  BOOK_PAGE_SUMMARY_RECORDING = 'book-page-summary-recording',
  BOOK_LISTENING = 'book-listening',
  QUESTION_ANSWER = 'question-answer'
}

interface Question {
  id: number;
  text: string;
  difficulty: 'Beginner' | 'Medium' | 'Advanced';
  studentAnswers: {
    correct: number;
    wrong: number;
  };
}

@Component({
  selector: 'app-assignment-submission',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MultipleQuestionsComponent,
    BookReadingComponent,
    BookPageSummaryRecordingComponent,
    StudentMarkingDrawerComponent,
    BookListeningComponent,
    QuestionAnswerComponent,
  ],
  templateUrl: './assignment-submission.component.html',
  styleUrl: './assignment-submission.component.scss',
})
export class AssignmentSubmissionComponent implements OnInit {
  @ViewChild(MultipleQuestionsComponent)
  multipleQuestionsComponent!: MultipleQuestionsComponent;

  showMarkingDrawer = false;

  // Make enum accessible in template
  SubmissionType = SubmissionType;

  sharedService = inject(SharedService);
  submissionService = inject(SubmissionService);

  studentSubmission: StudentSubmission = new StudentSubmission();
  questions: SubmissionQuestion[] = [];
  studentId: number;
  submissionId: number;
  submissionType: SubmissionType = SubmissionType.QUESTION_ANSWER;

  ngOnInit(): void {
    this.sharedService.pushTitle('ASSIGNMENT SUBMISSION');
    if (
      localStorage.getItem('submissionId') &&
      localStorage.getItem('studentId')
    ) {
      this.submissionId = parseInt(localStorage.getItem('submissionId'));
      this.studentId = parseInt(localStorage.getItem('studentId'));
      this.getSubmissions();
    }
  }

  getSubmissions() {
    this.submissionService
      .getStudentSubmission(this.submissionId, this.studentId)
      .subscribe((res) => {
        if (res.success) {
          this.studentSubmission = res.result;
          // Trigger the first skill to be expanded and load its questions
          if (this.studentSubmission.skills.length > 0) {
            // Use setTimeout to ensure the child component is initialized
            setTimeout(() => {
              this.multipleQuestionsComponent?.toggleSkill(
                this.studentSubmission.skills[0].skillId
              );
            });
          }
        }
      });
  }

  hasWrongAnswer(question: Question): boolean {
    return question.studentAnswers.wrong > 0;
  }

  hasOnlyCorrectAnswers(question: Question): boolean {
    return (
      question.studentAnswers.correct > 0 && question.studentAnswers.wrong === 0
    );
  }

  correctSubmission() {
    this.showMarkingDrawer = true;
  }
}
