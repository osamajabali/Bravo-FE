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
import { AssignmentTypes } from '../../../../core/models/assignment/assignment-types.model';
import { AssignmentStories, Story, StoryPaginationResponse } from '../../../../core/models/assignment/assignment-stories.model';
import { AddingAssignmentService } from '../../../../core/services/assignment/adding-assignment.service';
import { PaginatorState } from 'primeng/paginator';
import { PaginationComponent } from "../../pagination/pagination.component";

@Component({
  selector: 'app-oral-assignment-book',
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
  templateUrl: './oral-assignment-book.component.html',
  styleUrl: './oral-assignment-book.component.scss',
})
export class OralAssignmentBookComponent implements OnInit {

  selectedOption: string = 'isBookSelected';
  showBookDrawer = false;
  selectedBook: Story | null = null;

  // Preview popup state
  showPreviewPopup: boolean = false;
  previewBookTitle: string = '';

  readingFilter = {
    searchValue: '',
  };

  assignmentStories: AssignmentStories = new AssignmentStories();
  addingAssignmentService = inject(AddingAssignmentService);
  subLevels: { readingSubLevelId: number; name: string; }[] = [];
  books: StoryPaginationResponse = new StoryPaginationResponse();
  first: number = 0;
  assignmentType : AssignmentTypes = new AssignmentTypes();

  ngOnInit(): void {
    this.getSublevelReading();
  }

  getSublevelReading() {
    this.addingAssignmentService.getAssignmentReadingSublevels().subscribe(res => {
      if (res.success) {
        this.subLevels = res.result;
      }
    });

    if(localStorage.getItem('selectedAssignmentType')){
      this.assignmentType = JSON.parse(localStorage.getItem('selectedAssignmentType'));   
    }
  }

  getAssignmentStories() {
    let assignmentSetup: AssignmentTypes = JSON.parse(localStorage.getItem('selectedAssignmentType'));
    this.assignmentStories.assignmentTypeId = assignmentSetup.assignmentTypeId;
    this.addingAssignmentService.getAssignmentStories(this.assignmentStories).subscribe(res => {
      if (res.success) {
        this.books = res.result
      }
    })
  }

  nextPage($event: PaginatorState) {
    this.assignmentStories.pageNumber = $event.page;
    this.first = $event.first;
    this.getAssignmentStories();
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

  onQuestionsSelected(questions: any[]) {
    console.log('Selected questions for book:', questions);
    // Handle the selected questions from the book preview
  }
}
