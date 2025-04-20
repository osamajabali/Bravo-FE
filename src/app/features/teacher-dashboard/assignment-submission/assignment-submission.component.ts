import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface Question {
  id: number;
  text: string;
  difficulty: 'Beginner' | 'Medium' | 'Advanced';
  studentAnswers: {
    correct: number;
    wrong: number;
  };
}

interface Skill {
  id: number;
  name: string;
  expanded: boolean;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: string;
  questions: Question[];
}

@Component({
  selector: 'app-assignment-submission',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './assignment-submission.component.html',
  styleUrl: './assignment-submission.component.scss'
})
export class AssignmentSubmissionComponent implements OnInit {
  sharedService = inject(SharedService);
  
  skills: Skill[] = [
    {
      id: 1,
      name: 'Reading Comprehension',
      expanded: true,
      correctAnswers: 3,
      wrongAnswers: 1,
      timeSpent: '5:20',
      questions: [
        {
          id: 1,
          text: 'What is the main idea of the passage?',
          difficulty: 'Beginner',
          studentAnswers: {
            correct: 1,
            wrong: 0
          }
        },
        {
          id: 2,
          text: 'What can be inferred from the third paragraph?',
          difficulty: 'Medium',
          studentAnswers: {
            correct: 1,
            wrong: 0
          }
        },
        {
          id: 3,
          text: 'Which statement best supports the author\'s argument?',
          difficulty: 'Advanced',
          studentAnswers: {
            correct: 1,
            wrong: 0
          }
        }
      ]
    },
    {
      id: 2,
      name: 'Vocabulary',
      expanded: false,
      correctAnswers: 1,
      wrongAnswers: 2,
      timeSpent: '3:45',
      questions: [
        {
          id: 4,
          text: 'What is the meaning of "proliferate" in paragraph 2?',
          difficulty: 'Medium',
          studentAnswers: {
            correct: 0,
            wrong: 1
          }
        },
        {
          id: 5,
          text: 'Which word is the best synonym for "ambiguous"?',
          difficulty: 'Advanced',
          studentAnswers: {
            correct: 0,
            wrong: 1
          }
        },
        {
          id: 6,
          text: 'Choose the correct definition of "benevolent".',
          difficulty: 'Medium',
          studentAnswers: {
            correct: 1,
            wrong: 0
          }
        }
      ]
    },
    {
      id: 3,
      name: 'Grammar',
      expanded: false,
      correctAnswers: 2,
      wrongAnswers: 1,
      timeSpent: '4:10',
      questions: [
        {
          id: 7,
          text: 'Which sentence contains a subject-verb agreement error?',
          difficulty: 'Beginner',
          studentAnswers: {
            correct: 1,
            wrong: 0
          }
        },
        {
          id: 8,
          text: 'Identify the correct use of semicolons in the following sentences.',
          difficulty: 'Advanced',
          studentAnswers: {
            correct: 0,
            wrong: 1
          }
        },
        {
          id: 9,
          text: 'Select the sentence with the proper use of parallel structure.',
          difficulty: 'Medium',
          studentAnswers: {
            correct: 1,
            wrong: 0
          }
        }
      ]
    }
  ];

  ngOnInit(): void {
    this.sharedService.pushTitle('ASSIGNMENT SUBMISSION');
  }

  toggleSkill(skillId: number): void {
    const skill = this.skills.find(s => s.id === skillId);
    if (skill) {
      skill.expanded = !skill.expanded;
    }
  }

  hasWrongAnswer(question: Question): boolean {
    return question.studentAnswers.wrong > 0;
  }

  hasOnlyCorrectAnswers(question: Question): boolean {
    return question.studentAnswers.correct > 0 && question.studentAnswers.wrong === 0;
  }
}
