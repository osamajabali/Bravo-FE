import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { BookListViewComponent } from './book-list-view/book-list-view.component';
import { LeveledReadingViewComponent } from './leveled-reading-view/leveled-reading-view.component';

@Component({
  selector: 'app-leveled-reading',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    BookListViewComponent,
    LeveledReadingViewComponent
  ],
  templateUrl: './leveled-reading.component.html',
  styleUrl: './leveled-reading.component.scss',
})
export class LeveledReadingComponent {
  router = inject(Router);
  selectedTab = 'book-list';

  showStudentLevel() {
    this.router.navigate(['/features/student-level']);
  }

  showCriteria() {
    this.router.navigate(['/features/reading-criteria']);
  }
}
