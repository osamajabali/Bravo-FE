import { Component } from '@angular/core';
import { Book } from '../../../core/models/teacher-dashboard-models/leveled-reading';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/components/teacher-dashboard/header/header.component';

@Component({
  selector: 'app-leveled-reading',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './leveled-reading.component.html',
  styleUrl: './leveled-reading.component.scss',
})
export class LeveledReadingComponent {
  books: Book[] = [
    {
      title: 'من معالم القرآن',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'محطة الشباب',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'حجر سقراط في الجبال',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'الأرملة و الصبي',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'لغة، أيها المجد؟',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
    {
      title: 'بريق طه',
      subLevel: 'ز',
      author: 'احمد احمد',
      studentLevel: 'Advanced',
      coverImage: 'assets/images/book-image.svg',
    },
  ];
}
