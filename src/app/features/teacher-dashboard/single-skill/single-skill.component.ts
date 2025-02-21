import { Component } from '@angular/core';
import { SingleSkill } from '../models/single-skill';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-skill',
  imports: [CommonModule],
  templateUrl: './single-skill.component.html',
  styleUrl: './single-skill.component.scss',
})
export class SingleSkillComponent {
  skills: SingleSkill[] = [
    {
      title: 'تطوير مهارات اللغة العربية',
      levels: [
        'Advanced',
        'Beginner',
        'Advanced',
        'Beginner',
        'Advanced',
        'Beginner',
        'Advanced',
        'Beginner',
        'Advanced',
        'Beginner',
        'Advanced',
        'Beginner',
      ],
      lastUpdated: '2023/10/01',
    },
    {
      title: 'تطوير مهارات البرمجة',
      levels: ['Advanced', 'Beginner'],
      lastUpdated: '2023/09/15',
    },
    {
      title: 'تعليم المبتدئين',
      levels: ['Advanced', 'Beginner'],
    },
    {
      title: 'تعليم المبتدئين',
      levels: ['Advanced', 'Beginner', 'Beginner', 'Advanced'],
      lastUpdated: '2023/09/15',
    },
    {
      title: 'تعليم المبتدئين',
      levels: ['Advanced', 'Beginner'],
    },
    {
      title: 'تعليم المبتدئين',
      levels: ['Advanced', 'Beginner'],
      lastUpdated: '2023/09/15',
    },
    {
      title: 'تعليم المبتدئين',
      levels: ['Advanced', 'Beginner'],
    },
  ];
}
