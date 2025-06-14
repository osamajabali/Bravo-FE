import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DrawerModule } from 'primeng/drawer';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BookPreviewPopupComponent } from '../../book-preview-popup/book-preview-popup.component';

interface SelectionType {
  id: number;
  name: string;
}

interface LevelType {
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
  pages: number;
  wordsCount: number;
}

@Component({
  selector: 'app-assignment-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RadioButtonModule,
    SelectModule,
    InputTextModule,
    DropdownModule,
    DrawerModule,
    BookPreviewPopupComponent,
  ],
  templateUrl: './assignment-book.component.html',
  styleUrl: './assignment-book.component.scss',
})
export class AssignmentBookComponent {
  selectedOption: string = 'isBookSelected';
  showBookDrawer = false;
  selectedBook: Book | null = null;
  
  // Preview popup state
  showPreviewPopup: boolean = false;
  previewBookTitle: string = '';

  selectionTypes: SelectionType[] = [
    { id: 1, name: 'Teacher Selection' },
    { id: 2, name: 'Student Selection' },
    { id: 3, name: 'Random Selection' },
  ];

  levels: LevelType[] = [
    { id: 1, name: 'Level 1' },
    { id: 2, name: 'Level 2' },
    { id: 3, name: 'Level 3' },
  ];

  selectedType: SelectionType | null = null;
  selectedLevel: LevelType | null = null;

  // Mock data for books
  books: Book[] = [
    {
      id: 1,
      title: 'The Adventure Begins',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 2',
      authorName: 'John Smith',
      studentLevel: 'Beginner',
      pages: 10,
      wordsCount: 180
    },
    {
      id: 2,
      title: 'Mystery Island',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 3',
      authorName: 'Jane Doe',
      studentLevel: 'Beginner',
      pages: 15,
      wordsCount: 250
    },
    {
      id: 3,
      title: 'Space Explorers',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 1',
      authorName: 'Mike Johnson',
      studentLevel: 'Beginner',
      pages: 12,
      wordsCount: 200
    },
    {
      id: 4,
      title: 'Ocean Discovery',
      coverUrl: 'assets/images/book-image.svg',
      levelName: 'Level 2',
      authorName: 'Sarah Wilson',
      studentLevel: 'Beginner',
      pages: 8,
      wordsCount: 150
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

  onViewBook(book: Book) {
    this.onCloseDrawer();
    this.previewBookTitle = book.title;
    this.showPreviewPopup = true;
  }

  onQuestionsSelected(questions: any[]) {
    console.log('Selected questions for book:', questions);
    // Handle the selected questions from the book preview
  }
}
