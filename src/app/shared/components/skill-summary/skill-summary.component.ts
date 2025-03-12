import { Component, input } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-skill-summary',
  imports: [ButtonModule],
  templateUrl: './skill-summary.component.html',
  styleUrl: './skill-summary.component.scss',
})
export class SkillSummaryComponent {
  showAssignmentButton = input<boolean>(false);
  data = input<SkillSummaryData>();
}

export interface SkillSummaryData {
  allSkills: number;
  activeSkills: number;
  questionSolved: number;
  timeSpent: number;
}