import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { MediaPlayerComponent, MediaFile } from '../../media-player/media-player.component';

interface Question {
  id: number;
  questionText: string;
  questionFormat: 'text' | 'image' | 'voice' | 'video';
  description?: string;
  videoUrl?: string;
  uploadedImageFile?: File;
  uploadedImageFileName?: string;
  uploadedImageFileSize?: string;
  imageFileValidation?: {
    isValid: boolean;
    errorMessage?: string;
  };
  uploadedVoiceFile?: File;
  uploadedVoiceFileName?: string;
  uploadedVoiceFileSize?: string;
  voiceFileValidation?: {
    isValid: boolean;
    errorMessage?: string;
  };
  answerType: string;
  isCollapsed: boolean;
  isAudioPlaying?: boolean;
  audioDuration?: string;
  currentAudioTime?: string;
  audioProgress?: number;
  audioDurationSeconds?: number;
}

@Component({
  selector: 'app-review-writing-speaking',
  imports: [CommonModule, PanelModule, MediaPlayerComponent],
  templateUrl: './review-writing-speaking.component.html',
  styleUrl: './review-writing-speaking.component.scss'
})
export class ReviewWritingSpeakingComponent {
  @Output() stepChange = new EventEmitter<number>();
  @Input() type: string;
  @Input() questions: Question[] = [];

  title = computed(() => {
    return this.type === 'speaking' ? 'Speaking' : 'Writing';
  });

  todayDate = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');

  moveToStep(step: number) {
    this.stepChange.emit(step);
  }

  toggleCollapse(question: Question) {
    question.isCollapsed = !question.isCollapsed;
  }

  getAnswerTypeLabel(answerType: string): string {
    switch (answerType) {
      case 'keyboard':
        return 'Answer with Keyboard Input';
      case 'system':
        return 'System Correction';
      case 'upload':
        return 'Answer by Uploading an Image';
      default:
        return answerType;
    }
  }

  getImagePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // You can add a toast notification here if needed
      console.log('URL copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy URL: ', err);
    });
  }

  getMediaFileData(question: Question): MediaFile | null {
    if (!question.uploadedVoiceFile) return null;
    
    return {
      file: question.uploadedVoiceFile,
      fileName: question.uploadedVoiceFileName || '',
      fileSize: question.uploadedVoiceFileSize || '',
      isPlaying: question.isAudioPlaying,
      duration: question.audioDuration,
      currentTime: question.currentAudioTime,
      progress: question.audioProgress,
      durationSeconds: question.audioDurationSeconds
    };
  }

  onMediaFileChange(question: Question, updatedMediaFile: MediaFile) {
    question.isAudioPlaying = updatedMediaFile.isPlaying;
    question.audioDuration = updatedMediaFile.duration;
    question.currentAudioTime = updatedMediaFile.currentTime;
    question.audioProgress = updatedMediaFile.progress;
    question.audioDurationSeconds = updatedMediaFile.durationSeconds;
  }
}
