import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DrawerModule } from 'primeng/drawer';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BookPreviewPopupComponent } from '../../book-preview-popup/book-preview-popup.component';
import { AddingAssignmentService } from '../../../../core/services/assignment/adding-assignment.service';
import { AssignmentStories, Story, StoryPaginationResponse } from '../../../../core/models/assignment/assignment-stories.model';
import { PaginatorState } from 'primeng/paginator';
import { PaginationComponent } from "../../pagination/pagination.component";

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
    PaginationComponent
],
  templateUrl: './assignment-book.component.html',
  styleUrl: './assignment-book.component.scss',
})
export class AssignmentBookComponent implements OnInit {

  addingAssignmentService = inject(AddingAssignmentService);
  selectedOption: string = 'isBookSelected';
  showBookDrawer = false;
  selectedBook: Story | null = null;

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

  // Mock data for filters
  mainLevels = [
    { mainLevelId: 1, name: 'Level 1' },
    { mainLevelId: 2, name: 'Level 2' },
    { mainLevelId: 3, name: 'Level 3' },
  ];

  readingFilter = {
    searchValue: '',
  };
  subLevels: { readingSubLevelId: number; name: string; }[] = [];
  assignmentStories: AssignmentStories = new AssignmentStories();
  books: StoryPaginationResponse = new StoryPaginationResponse();
  first: number = 0;

  ngOnInit(): void {
    this.getSublevelReading();
  }

  getSublevelReading() {
    this.addingAssignmentService.getAssignmentReadingSublevels().subscribe(res => {
      if (res.success) {
        this.subLevels = res.result;
      }
    })
  }

  getAssignmentStories() {
    this.addingAssignmentService.getAssignmentStories(this.assignmentStories).subscribe(res => {
      if (res.success) {
        this.books = res.result
      }
    })
  }

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

  onBookSelect(book: Story) {
    this.selectedBook = book;
    this.showBookDrawer = false;
  }

  onRemoveBook() {
    this.selectedBook = null;
  }

  onViewBook(book: Story) {
    this.onCloseDrawer();
    this.previewBookTitle = book.title;
    this.showPreviewPopup = true;
  }

  nextPage($event: PaginatorState) {
    this.assignmentStories.pageNumber = $event.page;
    this.first = $event.first;
    this.getAssignmentStories();
  }

  onQuestionsSelected(questions: any[]) {
    console.log('Selected questions for book:', questions);
    // Handle the selected questions from the book preview
  }
}
