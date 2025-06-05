import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';

interface Skill {
  name: string;
  beginner: number;
  medium: number;
  advanced: number;
}

interface Domain {
  id: number;
  selectedDomain: string;
  skills: Skill[];
  isCollapsed: boolean;
}

@Component({
  selector: 'app-skills-review',
  imports: [
    CommonModule,
    PanelModule,
  ],
  templateUrl: './skills-review.component.html',
  styleUrl: './skills-review.component.scss',
})
export class SkillsReviewComponent {
  domains: Domain[] = [
    {
      id: 1,
      selectedDomain: 'math',
      isCollapsed: false,
      skills: [
        { name: 'Algebra', beginner: 5, medium: 3, advanced: 2 },
        { name: 'Geometry', beginner: 4, medium: 4, advanced: 1 },
        { name: 'Calculus', beginner: 2, medium: 3, advanced: 3 }
      ]
    },
    {
      id: 2,
      selectedDomain: 'science',
      isCollapsed: false,
      skills: [
        { name: 'Physics', beginner: 3, medium: 4, advanced: 2 },
        { name: 'Chemistry', beginner: 4, medium: 3, advanced: 2 }
      ]
    }
  ];

  domainNames = {
    'math': 'Mathematics',
    'science': 'Science',
    'language': 'Language Arts',
    'cs': 'Computer Science'
  };

  toggleCollapse(domain: Domain) {
    domain.isCollapsed = !domain.isCollapsed;
  }

  getTotalQuestions(domain: Domain): number {
    return domain.skills.reduce((total, skill) => {
      return total + skill.beginner + skill.medium + skill.advanced;
    }, 0);
  }
}
