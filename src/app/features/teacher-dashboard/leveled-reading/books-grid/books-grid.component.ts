import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import {
  LeveledBookSummaryComponent,
  SkillSummaryData,
} from '../../../../shared/components/leveled-book-summary/leveled-book-summary.component';
interface Book {
  id: number;
  image: string;
  title: string;
  authorName: string;
  status: 'Active' | 'Hidden';
  numberOfPages: number;
  isDisabled?: boolean;
}

@Component({
  selector: 'app-books-grid',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PaginationComponent,
    LeveledBookSummaryComponent,
  ],
  templateUrl: './books-grid.component.html',
  styleUrl: './books-grid.component.scss',
})
export class BooksGridComponent {
  router = inject(Router);
  bookSummaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };
  // Pagination
  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;

  books: Book[] = [
    {
      id: 1,
      image: 'assets/images/book-image.svg',
      title: 'القراءة للمبتدئين - المستوى الأول',
      authorName: 'أحمد محمد',
      status: 'Active',
      numberOfPages: 24,
    },
    {
      id: 2,
      image: 'assets/images/book-image.svg',
      title: 'أساسيات القراءة العربية',
      authorName: 'سارة علي',
      status: 'Hidden',
      numberOfPages: 32,
      isDisabled: true,
    },
    {
      id: 3,
      image: 'assets/images/book-image.svg',
      title: 'تعلم القراءة خطوة بخطوة',
      authorName: 'محمد أحمد',
      status: 'Active',
      numberOfPages: 28,
    },
  ];

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
  }

  viewBook(bookId: number): void {
    this.router.navigate(['/features/book-details']);
  }

  sendAssignment(bookId: number): void {
    // TODO: Implement send assignment functionality
    console.log('Sending assignment for book:', bookId);
  }
}
