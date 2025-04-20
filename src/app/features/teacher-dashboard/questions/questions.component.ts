import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/teacher-dashboard/button-ui/button/button.component';
import { Questions } from '../../../core/models/reading-models/questions.model';

@Component({
  selector: 'app-questions',
  imports: [CommonModule, ButtonComponent],

  templateUrl: './questions.component.html',
  styleUrl: './questions.component.scss',
})
export class QuestionsComponent {
  questions: Questions[] = [];
}
