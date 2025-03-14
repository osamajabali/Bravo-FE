import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Skill {
  id: number;
  name: string;
}

@Component({
  selector: 'app-book-comprehension',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-comprehension.component.html',
  styleUrls: ['./book-comprehension.component.scss']
})
export class BookComprehensionComponent {
  skills: Skill[] = [
    { id: 1, name: 'تحديد الفكرة الرئيسية' },
    { id: 2, name: 'تحليل الشخصيات' },
    { id: 3, name: 'فهم التسلسل الزمني للأحداث' },
    { id: 4, name: 'استخلاص النتائج' },
    { id: 5, name: 'تحديد السبب والنتيجة' },
    { id: 6, name: 'المقارنة والتباين' }
  ];
}
