import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Questions } from '../../../../core/models/reading-models/questions.model';

@Component({
  selector: 'app-book-questions',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './book-questions.component.html',
  styleUrls: ['./book-questions.component.scss']
})
export class BookQuestionsComponent {
  showQuestionDialog = false;
  selectedQuestion: Questions | null = null;

  @Input() questions: Questions[] = [];

  viewQuestion(question: Questions) {
    this.selectedQuestion = question;
    this.showQuestionDialog = true;
  }
}
