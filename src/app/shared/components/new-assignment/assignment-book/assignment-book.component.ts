import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DrawerModule } from 'primeng/drawer';

interface SelectionType {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  coverUrl: string;
  levelName: string;
  authorName: string;
  studentLevel: string;
}

@Component({
  selector: 'app-assignment-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CheckboxModule,
    SelectModule,
    InputTextModule,
    DropdownModule,
    DrawerModule,
  ],
  templateUrl: './assignment-book.component.html',
  styleUrl: './assignment-book.component.scss',
})
export class AssignmentBookComponent {
  isBookSelected = false;
  isStudentLevelSelected = false;
  showBookDrawer = false;
  selectedBook: Book | null = null;

  selectionTypes: SelectionType[] = [
    { id: 1, name: 'Teacher Selection' },
    { id: 2, name: 'Student Selection' },
    { id: 3, name: 'Random Selection' },
  ];

  selectedType: SelectionType | null = null;

  // Mock data for books
  books: Book[] = [
    {
      id: 1,
      title: 'The Adventure Begins',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 2',
      authorName: 'John Smith',
      studentLevel: 'Beginner',
    },
    {
      id: 2,
      title: 'Mystery Island',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 3',
      authorName: 'Jane Doe',
      studentLevel: 'Beginner',
    },
    {
      id: 3,
      title: 'Space Explorers',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 1',
      authorName: 'Mike Johnson',
      studentLevel: 'Beginner',
    },
    {
      id: 4,
      title: 'Ocean Discovery',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 2',
      authorName: 'Sarah Wilson',
      studentLevel: 'Beginner',
    },
  ];

  // Mock data for filters
  mainLevels = [
    { mainLevelId: 1, name: 'Level 1' },
    { mainLevelId: 2, name: 'Level 2' },
    { mainLevelId: 3, name: 'Level 3' },
  ];

  subLevels = [
    { subLevelId: 1, name: 'Sub Level A' },
    { subLevelId: 2, name: 'Sub Level B' },
    { subLevelId: 3, name: 'Sub Level C' },
  ];

  readingFilter = {
    searchValue: '',
    readingMainLevelId: null,
    readingSubLevelId: null,
  };

  onSelectBook() {
    this.showBookDrawer = true;
  }

  onCloseDrawer() {
    this.showBookDrawer = false;
  }

  onMainLevelChange(event: any) {
    // Handle main level change
    console.log('Main level changed:', event);
  }

  onSubLevelChange(mainLevelId: number, event: any) {
    // Handle sub level change
    console.log('Sub level changed:', event);
  }

  onBookSelect(book: Book) {
    this.selectedBook = book;
    this.showBookDrawer = false;
  }

  onRemoveBook() {
    this.selectedBook = null;
  }
}
