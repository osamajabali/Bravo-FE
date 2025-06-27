import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { HtmlDialogComponent } from '../../html-dialog/html-dialog.component';
import { MultipleQuestionsComponent } from '../multiple-questions/multiple-questions.component';

@Component({
  selector: 'app-book-reading',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, HtmlDialogComponent, MultipleQuestionsComponent],
  templateUrl: './book-reading.component.html',
  styleUrl: './book-reading.component.scss',
})
export class BookReadingComponent {
  showPreviewPopup: boolean = false;
  @Input() skills: any[] = [];
  @Input() submissionId: number = 0;
  @Input() studentId: number = 0;

  selectedBook = {
    coverImageUrl: 'assets/images/book-image.svg',
    title: 'Book Title',
    assignmentTypeName: 'Assignment Type Name',
    authorName: 'Author Name',
    mainLevelName: 'Main Level Name',
  };

  onAudioClick() {
    console.log('Audio clicked');
  }
}
