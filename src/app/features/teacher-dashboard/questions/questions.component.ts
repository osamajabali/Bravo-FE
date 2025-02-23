import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Question } from '../../../core/models/teacher-dashboard-models/question';
import { ButtonComponent } from '../../../shared/components/teacher-dashboard/button-ui/button/button.component';

@Component({
  selector: 'app-questions',
  imports: [CommonModule, ButtonComponent],

  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent {
  questions: Question[] = [
    { title: 'Question title here 1', answer: 'Right answer text here 1' },
    { title: 'Question title here 2', answer: 'Right answer text here 2' },
    { title: 'Question title here 3', answer: 'Right answer text here 3' },
    { title: 'Question title here 4', answer: 'Right answer text here 4' },
    { title: 'Question title here 5', answer: 'Right answer text here 5' },
  ];
}
