import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, input, output } from '@angular/core';
import { OralSubmissionDetails, Page } from '../../../core/models/assignment-submission/oral-submission-details';

@Component({
  selector: 'app-media-player',
  imports: [CommonModule],
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.scss']
})
export class MediaPlayerComponent implements OnInit, OnChanges {

  mediaFile = {
    isPlaying: false,
    currentTime: '',
    progress: 0,
    fileName: 'Full Audio Book', // You can dynamically set this as well
    fileDate: '2025-06-29'
  };

  showFileHeader = true;
  page = input<Page>(new Page);
  showReviewPage = input<boolean>(true);
  onReviewPageClick = output<number>();
  showRecordingControls = false;
  displayDate = new Date().toLocaleDateString();

  private audio: HTMLAudioElement;

  constructor() {

  }

  ngOnInit(): void {
    this.audio = new Audio(this.page().recordUrl);
    this.audio.addEventListener('timeupdate', this.updateProgress.bind(this));
    if (this.page().recordUrl) {
      this.audio.src = this.page().recordUrl; // Set the source URL on initialization
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Whenever the input property changes (i.e., new audioUrl), update the audio source
    if (changes['fullAnswersAudio'] && this.page().recordUrl) {
      this.audio.src = this.page().recordUrl;
    }
  }

  playAudio() {
    this.audio.play();
    this.mediaFile.isPlaying = true;
  }

  pauseAudio() {
    this.audio.pause();
    this.mediaFile.isPlaying = false;
  }

  updateProgress() {
    const progress = (this.audio.currentTime / this.audio.duration) * 100;
    this.mediaFile.currentTime = this.formatTime(this.audio.currentTime);
    this.mediaFile.progress = progress;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  goToReviewPage(pageId : number) {debugger
    this.onReviewPageClick.emit(pageId);
  }

  reRecording() {
    console.log('Re-recording...');
  }

  stopAudio() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.mediaFile.isPlaying = false;
    this.mediaFile.progress = 0;
  }
}
