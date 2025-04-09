import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

interface Question {
  id: number;
  title: string;
  imageUrl?: string;
  comprehensionSkill: string;
}

@Component({
  selector: 'app-book-questions',
  standalone: true,
  imports: [CommonModule, ButtonModule, DialogModule],
  templateUrl: './book-questions.component.html',
  styleUrls: ['./book-questions.component.scss']
})
export class BookQuestionsComponent {
  showQuestionDialog = false;
  selectedQuestion: Question | null = null;

  questions: Question[] = [
    {
      id: 1,
      title: 'ما هي الشخصيات الرئيسية في القصة وما هي صفاتها؟',
      imageUrl: 'assets/images/book-image.svg',
      comprehensionSkill: 'Comprehension Skill 1'
    },
    {
      id: 2,
      title: 'ما هو الدرس المستفاد من هذه القصة؟',
      imageUrl: 'assets/images/book-image.svg',
      comprehensionSkill: 'Comprehension Skill 2'
    },
    {
      id: 3,
      title: 'كيف تغيرت الشخصية الرئيسية من بداية القصة إلى نهايتها؟',
      imageUrl: 'assets/images/book-image.svg',
      comprehensionSkill: 'Comprehension Skill 3'
    }
  ];

  viewQuestion(question: Question) {
    this.selectedQuestion = question;
    this.showQuestionDialog = true;
  }
}
