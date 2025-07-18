import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HtmlDialogComponent } from '../../html-dialog/html-dialog.component';
import { ButtonModule } from 'primeng/button';
import { MediaPlayerComponent } from '../../media-player/media-player.component';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-book-listening',
  imports: [FormsModule, CommonModule, HtmlDialogComponent, ButtonModule, MediaPlayerComponent, DialogModule,TranslateModule],
  templateUrl: './book-listening.component.html',
  styleUrl: './book-listening.component.scss',
})
export class BookListeningComponent {
  showPreviewPopup: boolean = false;
  isPlaying: boolean = false;
  showPreviewBookPopup: boolean = false;

  viewType: 'list' | 'grid' = 'list';
  showReviewPopup: boolean = false;
  todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  mediaFile: any = {
    file: new File([], 'test.mp3'),
    fileName: 'test.mp3',
    fileSize: '100KB',
  };
  selectedBook = {
    coverImageUrl: 'assets/images/book-image.svg',
    title: 'Book Title',
    assignmentTypeName: 'Assignment Type Name',
    authorName: 'AUTHOR',
    mainLevelName: 'Main Level Name',
  };

  goToReviewPage() {
    this.showReviewPopup = true;
  }

  closeReviewPopup() {
    this.showReviewPopup = false;
  }

  playAll() {
    this.isPlaying = !this.isPlaying;
  }
}
