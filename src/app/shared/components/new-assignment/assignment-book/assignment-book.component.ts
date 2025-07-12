import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
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
import { AssignmentReadingPayload, AssignmentStories, Story, StoryPaginationResponse } from '../../../../core/models/assignment/assignment-stories.model';
import { PaginatorState } from 'primeng/paginator';
import { PaginationComponent } from "../../pagination/pagination.component";
import { AssignmentSetup } from '../../../../core/models/assignment/assignment-setup.model';
import { AssignmentTypes } from '../../../../core/models/assignment/assignment-types.model';
import { TranslateModule } from '@ngx-translate/core';

export interface SelectionType {
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
    PaginationComponent,
    TranslateModule
  ],
  templateUrl: './assignment-book.component.html',
  styleUrl: './assignment-book.component.scss',
})
export class AssignmentBookComponent implements OnInit {
  @Output() isSetupValid = new EventEmitter<boolean>();

  addingAssignmentService = inject(AddingAssignmentService);
  selectedOption: boolean = false;
  showBookDrawer = false;
  selectedBook: Story | null = null;

  // Preview popup state
  showPreviewPopup: boolean = false;
  previewBookTitle: string = '';

  selectionTypes: SelectionType[] = [
    { id: 0, name: 'select' },
    { id: 1, name: 'Teacher Selection' },
    { id: 3, name: 'Random Selection' },
  ];

  levels: LevelType[] = [
    { id: 1, name: 'Level 1' },
    { id: 2, name: 'Level 2' },
    { id: 3, name: 'Level 3' },
  ];

  selectedType: SelectionType | null = null;
  selectionType: SelectionType | null = null;
  selectedLevel: LevelType | null = null;
  assignmentType: AssignmentTypes = new AssignmentTypes();

  readingFilter = {
    searchValue: '',
  };
  subLevels: { readingSubLevelId: number; name: string; }[] = [];
  assignmentStories: AssignmentStories = new AssignmentStories();
  books: StoryPaginationResponse = new StoryPaginationResponse();
  first: number = 0;
  assignmentBook: AssignmentReadingPayload = new AssignmentReadingPayload()

  ngOnInit(): void {
    
    this.getSublevelReading();

  }

  getSublevelReading() {
    this.isSetupValid.emit(true);
    this.addingAssignmentService.getAssignmentReadingSublevels().subscribe(res => {
      if (res.success) {
        this.subLevels = res.result;
        if (localStorage.getItem('assignmentBookReading')) {
          this.assignmentBook = JSON.parse(localStorage.getItem('assignmentBookReading'));
          this.selectedBook = this.assignmentBook.book;
          this.selectedType = this.selectionTypes[0];
          this.assignmentStories = this.assignmentBook.assignmentStories;
          this.selectedOption = this.assignmentBook.isSelectBook;
          this.assignmentType.name = this.assignmentBook.assignmentTypeName;
          if (localStorage.getItem('selectedOption')) {
            this.selectedOption = localStorage.getItem('selectedOption') == 'false' ? false : true
          }
          if (localStorage.getItem('selectedAssignmentType')) {
            this.assignmentType = JSON.parse(localStorage.getItem('selectedAssignmentType'));
            this.updateValue()
          }
          this.updateValue()
        }
      }
    });
  }

  getAssignmentStories() {
    let assignmentSetup: AssignmentTypes = JSON.parse(localStorage.getItem('selectedAssignmentType'));
    this.assignmentStories.assignmentTypeId = assignmentSetup.assignmentTypeId;
    this.addingAssignmentService.getAssignmentStories(this.assignmentStories).subscribe(res => {
      if (res.success) {
        this.books = res.result;
        this.showBookDrawer = true;
      }
    })
  }

  searchStories() {
    if (!this.readingFilter.searchValue) return;
    let assignmentSetup: AssignmentTypes = JSON.parse(localStorage.getItem('selectedAssignmentType'));
    this.assignmentStories.assignmentTypeId = assignmentSetup.assignmentTypeId;
    this.assignmentStories.searchValue = this.readingFilter.searchValue ? this.readingFilter.searchValue : '';
    this.addingAssignmentService.getAssignmentStories(this.assignmentStories).subscribe(res => {
      if (res.success) {
        this.books = res.result;
        this.showBookDrawer = true;
      }
    })
  }

  onSelectBook() {
    this.getAssignmentStories()
  }

  checkValue() {
    localStorage.setItem('selectedOption', JSON.stringify(this.selectedOption));
    this.updateValue()
  }

  updateValue() {
    this.assignmentBook = {
      book: this.selectedBook,
      isSelectBook: this.selectedOption,
      selectedType: this.selectedType,
      assignmentStories: this.assignmentStories,
      assignmentTypeName: this.assignmentStories.readingSubLevelId ? this.subLevels.find(x => x.readingSubLevelId == this.assignmentStories.readingSubLevelId).name : '',
      bookSelectionCreteria: this.selectedOption ? 1 : 0,
      correctionType: null
    }

    if (!this.selectedOption) {
      this.isSetupValid.emit(false)
    } else {
      this.isSetupValid.emit(true)
      if (this.assignmentBook.assignmentStories && this.assignmentBook.book && this.assignmentBook.selectedType) {
        this.isSetupValid.emit(false);
      } else {
        this.isSetupValid.emit(true)
      }
    }


    localStorage.setItem('assignmentBookReading', JSON.stringify(this.assignmentBook))
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
    this.selectedBook.assignmentTypeName = this.subLevels.find(x => x.readingSubLevelId == this.assignmentStories.readingSubLevelId).name;

    this.updateValue()
  }

  onRemoveBook() {
    this.selectedBook = null;
    this.assignmentStories.pageNumber = 1;
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
