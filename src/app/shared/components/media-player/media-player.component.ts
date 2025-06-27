import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface MediaFile {
  file: File;
  fileName: string;
  fileSize: string;
  isPlaying?: boolean;
  duration?: string;
  currentTime?: string;
  progress?: number;
  durationSeconds?: number;
}

@Component({
  selector: 'app-media-player',
  imports: [CommonModule],
  templateUrl: './media-player.component.html',
  styleUrl: './media-player.component.scss',
})
export class MediaPlayerComponent {
  @Input() mediaFile!: MediaFile;
  @Input() displayDate: string = '';
  @Input() showReviewPage: boolean = false;
  @Output() mediaFileChange = new EventEmitter<MediaFile>();
  @Output() onReviewPageClick = new EventEmitter<void>();

  private currentAudio: HTMLAudioElement | null = null;

  playAudio() {
    if (!this.mediaFile.file) return;

    // Stop any currently playing audio
    this.stopCurrentAudio();

    // Create new audio element
    const audio = new Audio();
    const audioUrl = URL.createObjectURL(this.mediaFile.file);
    audio.src = audioUrl;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      this.mediaFile.duration = this.formatTime(audio.duration);
      this.mediaFile.durationSeconds = audio.duration;
      this.mediaFile.progress = 0;
      this.mediaFileChange.emit(this.mediaFile);
    });

    audio.addEventListener('timeupdate', () => {
      this.mediaFile.currentTime = this.formatTime(audio.currentTime);
      if (
        this.mediaFile.durationSeconds &&
        this.mediaFile.durationSeconds > 0
      ) {
        this.mediaFile.progress =
          (audio.currentTime / this.mediaFile.durationSeconds) * 100;
      }
      this.mediaFileChange.emit(this.mediaFile);
    });

    audio.addEventListener('ended', () => {
      this.mediaFile.isPlaying = false;
      this.mediaFile.currentTime = '0:00';
      URL.revokeObjectURL(audioUrl);
      this.currentAudio = null;
      this.mediaFileChange.emit(this.mediaFile);
    });

    audio.addEventListener('error', () => {
      this.mediaFile.isPlaying = false;
      URL.revokeObjectURL(audioUrl);
      console.error('Error playing audio file');
      this.mediaFileChange.emit(this.mediaFile);
    });

    // Play the audio
    audio
      .play()
      .then(() => {
        this.mediaFile.isPlaying = true;
        this.currentAudio = audio;
        this.mediaFileChange.emit(this.mediaFile);
      })
      .catch((err) => {
        console.error('Failed to play audio:', err);
        URL.revokeObjectURL(audioUrl);
      });
  }

  pauseAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.mediaFile.isPlaying = false;
      this.mediaFileChange.emit(this.mediaFile);
    }
  }

  goToReviewPage() {
    this.onReviewPageClick.emit();
  }

  private stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.mediaFile.isPlaying = false;
      this.mediaFile.currentTime = '0:00';
      this.currentAudio = null;
      this.mediaFileChange.emit(this.mediaFile);
    }
  }

  private formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
