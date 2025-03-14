import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface LeveledBook {
  title: string;
  level: string;
}

@Component({
  selector: 'app-leveled-reading-view',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    FormsModule
  ],
  templateUrl: './leveled-reading-view.component.html',
  styleUrl: './leveled-reading-view.component.scss'
})
export class LeveledReadingViewComponent {
  router = inject(Router);
  selectedLevel: any = null;
  
  levels = [
    { label: 'Level A', value: 'a' },
    { label: 'Level B', value: 'b' },
    { label: 'Level C', value: 'c' },
    { label: 'Level D', value: 'd' }
  ];

  books: LeveledBook[] = [
    { title: 'القراءة للمبتدئين - المستوى الأول', level: 'a' },
    { title: 'أساسيات القراءة العربية', level: 'a' },
    { title: 'تعلم القراءة خطوة بخطوة', level: 'b' },
    { title: 'مهارات القراءة المتقدمة', level: 'c' },
    { title: 'القراءة السريعة والفهم', level: 'd' },
    { title: 'تطوير مهارات القراءة', level: 'b' }
  ];

  onLevelChange() {
    // TODO: Implement level filter logic
  }

  viewBook(book: LeveledBook) {
    this.router.navigate(['/features/book-details']);
  }
} 