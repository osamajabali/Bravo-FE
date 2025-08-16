import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';

interface Skill {
  name: string;
  id: number;
}

@Component({
  selector: 'app-learner-overview',
  imports: [CommonModule, FormsModule, ButtonModule, TranslateModule],
  templateUrl: './learner-overview.component.html',
  styleUrl: './learner-overview.component.scss',
})
export class LearnerOverviewComponent {
  topSkills: Skill[] = [
    {
      name: 'Skill 1',
      id: 1,
    },
    {
      name: 'Skill 2',
      id: 2,
    },
    {
      name: 'Skill 3',
      id: 3,
    },
    {
      name: 'Skill 4',
      id: 4,
    },
    {
      name: 'Skill 5',
      id: 5,
    },
    {
      name: 'Skill 6',
      id: 6,
    },
  ];

  lowSkills: Skill[] = [
    {
      name: 'Skill 1',
      id: 1,
    },
    {
      name: 'Skill 2',
      id: 2,
    },
    {
      name: 'Skill 3',
      id: 3,
    },
    {
      name: 'Skill 4',
      id: 4,
    },
    {
      name: 'Skill 5',
      id: 5,
    },
    {
      name: 'Skill 6',
      id: 6,
    },
  ];

  onSendAssignment(): void {
    console.log('Send Assignment clicked for learner:');
    // TODO: Implement send assignment functionality
  }
}
