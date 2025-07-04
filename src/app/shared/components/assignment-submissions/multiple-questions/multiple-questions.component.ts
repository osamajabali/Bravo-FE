import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionService } from '../../../../core/services/assignment/submission.service';
import { SubmissionQuestion, Skill } from '../../../../core/models/assignment/student-submission.model';
import { QuestionsSubmissions } from '../../../../core/models/assignment-submission/reading-submission-details';

@Component({
  selector: 'app-multiple-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-questions.component.html',
  styleUrl: './multiple-questions.component.scss'
})
export class MultipleQuestionsComponent {
  @Input() skills: Skill[] = [];
  @Input() submissionId: number = 0;
  @Input() studentId: number = 0;

  submissionService = inject(SubmissionService);
  questions: SubmissionQuestion[] = [];

  toggleSkill(skillId: number): void {
    this.submissionService.getSkillQuestions(this.submissionId, this.studentId, skillId).subscribe(res => {
      if (res.success) {
        this.questions = res.result;
      }
    })
  }
} 