import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Question {
  text: string;
  timeSpent: string;
  color: string;
  answerBtnColor: string;
  answerBtnTextColor: string;
  answerBtnText: string;
  answerBtnIconUrl: string;
  isCorrect: boolean;
}

interface Flag {
  iconUrl: string;
  title?: string;
  value?: string;
}

interface Skill {
  skillId: number;
  name?: string;
  skillName?: string;
  expanded: boolean;
  difficulty: string;
  flags: Flag[];
  questions?: Question[];
}

@Component({
  selector: 'app-learner-collapsible-sections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './learner-collapsible-sections.component.html',
  styleUrl: './learner-collapsible-sections.component.scss'
})
export class LearnerCollapsibleSectionsComponent {
  selectedId: number = 0;

  // Static data instead of API calls
  skills: Skill[] = [
    {
      skillId: 1,
      name: 'Reading Comprehension',
      expanded: false,
      difficulty: 'Beginner',
      flags: [
        { iconUrl: 'icon-green-check.svg', title: 'Correct', value: '8' },
        { iconUrl: 'icon-red-close.svg', title: 'Wrong', value: '2' },
        { iconUrl: 'icon-light-yellow-clock.svg', title: 'Total', value: '10' },
        { iconUrl: 'icon-green-flag-filled.svg' }
      ],
      questions: [
        {
          text: 'What is the main idea of the passage?',
          timeSpent: '10s',
          color: '#FFE8DC',
          answerBtnColor: '#E8F5E8',
          answerBtnText: 'Show Correct Answer',
          answerBtnIconUrl: 'icon-green-eye.svg',
          answerBtnTextColor: '#00632B',
          isCorrect: true
        },
        {
          text: 'Which character showed the most courage?',
          timeSpent: '10s',
          color: '#FFF4E6',
          answerBtnColor: '#FFE8E8',
          answerBtnText: 'Show Wrong Answer',
          answerBtnIconUrl: 'icon-red-eye.svg',
          answerBtnTextColor: '#B01212',
          isCorrect: false
        },
        {
          text: 'Explain the author\'s perspective on the topic.',
          timeSpent: '10s',
          color: '#E8F4FD',
          answerBtnColor: '#E8F5E8',
          answerBtnText: 'Show Correct Answer',
          answerBtnIconUrl: 'icon-green-eye.svg',
          answerBtnTextColor: '#00632B',
          isCorrect: true
        }
      ]
    },
    {
      skillId: 2,
      name: 'Vocabulary',
      expanded: false,
      difficulty: 'Medium',
      flags: [
        { iconUrl: 'icon-green-check.svg', title: 'Correct', value: '12' },
        { iconUrl: 'icon-red-close.svg', title: 'Wrong', value: '3' },
        { iconUrl: 'icon-light-yellow-clock.svg', title: 'Total', value: '15' }
      ],
      questions: [
        {
          text: 'What does the word "magnificent" mean?',
          timeSpent: '10s',
          color: '#FFE8DC',
          answerBtnColor: '#E8F5E8',
          answerBtnText: 'Show Correct Answer',
          answerBtnIconUrl: 'icon-green-eye.svg',
          answerBtnTextColor: '#00632B',
          isCorrect: true
        },
        {
          text: 'Choose the synonym for "elated".',
          timeSpent: '10s',
          color: '#FFF4E6',
          answerBtnColor: '#E8F5E8',
          answerBtnText: 'Show Correct Answer',
          answerBtnIconUrl: 'icon-green-eye.svg',
          answerBtnTextColor: '#00632B',
          isCorrect: true
        },
        {
          text: 'Use "perseverance" in a sentence.',
          timeSpent: '10s',
          color: '#E8F4FD',
          answerBtnColor: '#FFE8E8',
          answerBtnText: 'Show Wrong Answer',
          answerBtnIconUrl: 'icon-red-eye.svg',
          answerBtnTextColor: '#B01212',
          isCorrect: false
        }
      ]
    },
    {
      skillId: 3,
      name: 'Grammar',
      expanded: false,
      difficulty: 'Advanced',
      flags: [
        { iconUrl: 'icon-green-check.svg', title: 'Correct', value: '6' },
        { iconUrl: 'icon-red-close.svg', title: 'Wrong', value: '4' },
        { iconUrl: 'icon-light-yellow-clock.svg', title: 'Total', value: '10' }
      ],
      questions: [
        {
          text: 'Identify the subject in this sentence.',
          timeSpent: '10s',
          color: '#FFE8DC',
          answerBtnColor: '#E8F5E8',
          answerBtnText: 'Show Correct Answer',
          answerBtnIconUrl: 'icon-green-eye.svg',
          answerBtnTextColor: '#00632B',
          isCorrect: true
        },
        {
          text: 'Choose the correct verb tense.',
          timeSpent: '10s',
          color: '#FFF4E6',
          answerBtnColor: '#FFE8E8',
          answerBtnText: 'Show Correct Answer',
          answerBtnIconUrl: 'icon-red-eye.svg',
          answerBtnTextColor: '#B01212',
          isCorrect: false
        }
      ]
    },
    {
      skillId: 4,
      name: 'Writing Skills',
      expanded: false,
      difficulty: 'Advanced',
      flags: [
        { iconUrl: 'icon-green-check.svg', title: 'Correct', value: '5' },
        { iconUrl: 'icon-red-close.svg', title: 'Wrong', value: '2' },
        { iconUrl: 'icon-light-yellow-clock.svg', title: 'Total', value: '7' }
      ],
      questions: [
        {
          text: 'Write a topic sentence for the paragraph.',
          timeSpent: '10s',
          color: '#FFF4E6',
          answerBtnColor: '#E8F5E8',
          answerBtnText: 'Show Correct Answer',
          answerBtnIconUrl: 'icon-green-eye.svg',
          answerBtnTextColor: '#00632B',
          isCorrect: true
        },
        {
          text: 'Organize these sentences into a coherent paragraph.',
          timeSpent: '10s',
          color: '#E8F4FD',
          answerBtnColor: '#FFE8E8',
          answerBtnText: 'Show Wrong Answer',
          answerBtnIconUrl: 'icon-red-eye.svg',
          answerBtnTextColor: '#B01212',
          isCorrect: false
        }
      ]
    }
  ];

  expandSkill(skillId: number) {
    // Collapse all other skills if a different skill is selected
    if (this.selectedId !== skillId) {
      this.skills.forEach(skill => skill.expanded = false);
    }
    
    const skill = this.skills.find(s => s.skillId === skillId);
    if (skill) {
      // Toggle the selected skill
      skill.expanded = !skill.expanded;
    }
    
    this.selectedId = skillId;
  }
}
