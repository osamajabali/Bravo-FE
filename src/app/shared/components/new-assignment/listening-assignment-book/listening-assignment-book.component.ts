import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DrawerModule } from 'primeng/drawer';
import { BookPreviewPopupComponent } from '../../book-preview-popup/book-preview-popup.component';
import { PaginatorState } from 'primeng/paginator';
import { AssignmentReadingPayload, AssignmentStories, Story, StoryPaginationResponse } from '../../../../core/models/assignment/assignment-stories.model';
import { AssignmentTypes } from '../../../../core/models/assignment/assignment-types.model';
import { AddingAssignmentService } from '../../../../core/services/assignment/adding-assignment.service';
import { PaginationComponent } from "../../pagination/pagination.component";
import { SelectionType } from '../assignment-book/assignment-book.component';

@Component({
  selector: 'app-listening-assignment-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    DropdownModule,
    DrawerModule,
    BookPreviewPopupComponent,
    PaginationComponent
],
  templateUrl: './listening-assignment-book.component.html',
  styleUrl: './listening-assignment-book.component.scss',
})
export class ListeningAssignmentBookComponent {
   @Output() isSetupValid = new EventEmitter<boolean>();
 
   addingAssignmentService = inject(AddingAssignmentService);
   selectedOption: boolean = false;
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
 
   selectedType: SelectionType | null = null;
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
           this.selectedType = this.selectionTypes.find(x => x.id == this.assignmentType.assignmentTypeId);
           this.assignmentStories = this.assignmentBook.assignmentStories;
           this.selectedOption = this.assignmentBook.isSelectBook;
           this.assignmentType.name = this.assignmentBook.assignmentTypeName;
           this.updateValue()
         }
       }
     });
 
     if (localStorage.getItem('selectedAssignmentType')) {
       this.assignmentType = JSON.parse(localStorage.getItem('selectedAssignmentType'));
     }
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
 
   onSelectBook() {
     this.getAssignmentStories()
   }
 
   updateValue() {
     this.assignmentBook = {
       book: this.selectedBook,
       isSelectBook: this.selectedOption,
       selectedType: this.selectedType,
       assignmentStories: this.assignmentStories,
       assignmentTypeName: this.assignmentStories.readingSubLevelId ? this.subLevels.find(x => x.readingSubLevelId == this.assignmentStories.readingSubLevelId).name : '',
       bookSelectionCreteria: null,
       correctionType : this.selectedOption ? 1 : 0
     }
     if (this.assignmentBook.assignmentStories && this.assignmentBook.book) {
       this.isSetupValid.emit(false);
     } else {
       this.isSetupValid.emit(true)
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
 