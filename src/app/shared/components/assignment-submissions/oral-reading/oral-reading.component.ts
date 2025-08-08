import { CommonModule } from '@angular/common';
import { Component, inject, input, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { HtmlDialogComponent } from '../../html-dialog/html-dialog.component';
import { MediaPlayerComponent } from '../../media-player/media-player.component';
import { OralSubmissionDetails } from '../../../../core/models/assignment-submission/oral-submission-details';
import { SubmissionService } from '../../../../core/services/assignment/submission.service';
import { StoryPage } from '../../../../core/models/assignment-submission/story-page';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-oral-reading',
  imports: [FormsModule, CommonModule, HtmlDialogComponent, ButtonModule, MediaPlayerComponent, DialogModule, TranslateModule],
  templateUrl: './oral-reading.component.html',
  styleUrl: './oral-reading.component.scss'
})
export class OralReadingComponent implements OnInit {
  submissionService = inject(SubmissionService);
  showPreviewPopup: boolean = false;
  isPlaying: boolean = false;
  showPreviewBookPopup: boolean = false;
  oralSubmissionDetails = input<OralSubmissionDetails>(new OralSubmissionDetails);
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
  storyPage: StoryPage = new StoryPage();
  private audio: HTMLAudioElement;

  ngOnInit(): void {
    
  }

  goToReviewPage(pageId: number) {
    this.submissionService.getStoryPage(pageId).subscribe(res => {
      if (res) {
        this.storyPage = res.result;
        this.showReviewPopup = true;
      }
    })
  }

  closeReviewPopup() {
    this.showReviewPopup = false;
  }

  playAll() {
    this.isPlaying = !this.isPlaying;
    if (!this.isPlaying) {
      this.audio.pause();
      return
    }
    this.audio = new Audio(this.oralSubmissionDetails().fullAnswersAudio);
    if (this.oralSubmissionDetails().fullAnswersAudio) {
      this.audio.src = this.oralSubmissionDetails().fullAnswersAudio; // Set the source URL on initialization
    }
    this.audio.play();
  }
}
