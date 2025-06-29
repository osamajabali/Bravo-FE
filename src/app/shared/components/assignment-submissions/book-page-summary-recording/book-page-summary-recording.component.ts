import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MediaPlayerComponent } from '../../media-player/media-player.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-page-summary-recording',
  imports: [CommonModule, ButtonModule, DialogModule, MediaPlayerComponent, FormsModule],
  templateUrl: './book-page-summary-recording.component.html',
  styleUrl: './book-page-summary-recording.component.scss',
})
export class BookPageSummaryRecordingComponent {
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

  goToReviewPage() {
    this.showReviewPopup = true;
  }

  closeReviewPopup() {
    this.showReviewPopup = false;
  }
}
