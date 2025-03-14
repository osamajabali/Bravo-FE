import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface Question {
  id: number;
  title: string;
}

@Component({
  selector: 'app-book-questions',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './book-questions.component.html',
  styleUrls: ['./book-questions.component.scss']
})
export class BookQuestionsComponent {
  questions: Question[] = [
    {
      id: 1,
      title: 'ما هي الشخصيات الرئيسية في القصة وما هي صفاتها؟'
    },
    {
      id: 2,
      title: 'ما هو الدرس المستفاد من هذه القصة؟'
    },
    {
      id: 3,
      title: 'كيف تغيرت الشخصية الرئيسية من بداية القصة إلى نهايتها؟'
    }
  ];

  viewQuestion(question: Question) {
    // TODO: Implement view question functionality
    console.log('Viewing question:', question.id);
  }
}
