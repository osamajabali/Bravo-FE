import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmissionService } from '../../../../core/services/assignment/submission.service';
import { SubmissionQuestion, Skill } from '../../../../core/models/assignment/student-submission.model';
import { QuestionsSubmissions } from '../../../../core/models/assignment-submission/reading-submission-details';
import { SkillData } from '../../../../core/models/assignment-submission/assignment-submission-1uestion.model';

@Component({
  selector: 'app-multiple-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './multiple-questions.component.html',
  styleUrl: './multiple-questions.component.scss'
})
export class MultipleQuestionsComponent {
  @Input() skills: Skill[];
  @Input() skilldata: SkillData;
  @Input() submissionId: number = 0;
  @Input() studentId: number = 0;
  selectedId: number = 0;

  submissionService = inject(SubmissionService);
  questions: SubmissionQuestion[] = [];

  toggleSkill(skillId: number): void {
    this.submissionService.getSkillQuestions(this.submissionId, this.studentId, skillId).subscribe(res => {
      if (res.success) {
        this.questions = res.result;
      }
    })
  }

  expandSkill(skillId: number) {
    if (Array.isArray(this.skills)) {
      // Iterate through all skills and collapse them
      if (this.selectedId != skillId) {
        this.skills.forEach(x => x.expanded = false);
      }
      
      const skill = this.skills.find(x => x.skillId === skillId);
      if (skill) {
        // If the selected skill is already expanded, collapse it
        skill.expanded = !skill.expanded;
      }
    } else if (this.skilldata) {
      // Iterate through all skills and collapse them
      if (this.selectedId != skillId) {
        this.skilldata.skills.forEach(x => x.expanded = false);
      }
      
      const skill = this.skilldata.skills.find(x => x.skillId === skillId);
      if (skill) {
        // If the selected skill is already expanded, collapse it
        skill.expanded = !skill.expanded;
      }
    }
    this.selectedId = skillId;
  }

} 