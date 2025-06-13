import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';

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
  imports: [CommonModule, PanelModule],
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

  private currentAudio: HTMLAudioElement | null = null;
  private currentPlayingQuestion: Question | null = null;

  playAudio(question: Question) {
    if (!question.uploadedVoiceFile) return;

    // Stop any currently playing audio
    this.stopCurrentAudio();

    // Create new audio element
    const audio = new Audio();
    const audioUrl = URL.createObjectURL(question.uploadedVoiceFile);
    audio.src = audioUrl;

    // Set up event listeners
    audio.addEventListener('loadedmetadata', () => {
      question.audioDuration = this.formatTime(audio.duration);
      question.audioDurationSeconds = audio.duration;
      question.audioProgress = 0;
    });

    audio.addEventListener('timeupdate', () => {
      question.currentAudioTime = this.formatTime(audio.currentTime);
      if (question.audioDurationSeconds && question.audioDurationSeconds > 0) {
        question.audioProgress = (audio.currentTime / question.audioDurationSeconds) * 100;
      }
    });

    audio.addEventListener('ended', () => {
      question.isAudioPlaying = false;
      question.currentAudioTime = '0:00';
      URL.revokeObjectURL(audioUrl);
      this.currentAudio = null;
      this.currentPlayingQuestion = null;
    });

    audio.addEventListener('error', () => {
      question.isAudioPlaying = false;
      URL.revokeObjectURL(audioUrl);
      console.error('Error playing audio file');
    });

    // Play the audio
    audio.play().then(() => {
      question.isAudioPlaying = true;
      this.currentAudio = audio;
      this.currentPlayingQuestion = question;
    }).catch(err => {
      console.error('Failed to play audio:', err);
      URL.revokeObjectURL(audioUrl);
    });
  }

  pauseAudio(question: Question) {
    if (this.currentAudio && this.currentPlayingQuestion === question) {
      this.currentAudio.pause();
      question.isAudioPlaying = false;
    }
  }

  private stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      if (this.currentPlayingQuestion) {
        this.currentPlayingQuestion.isAudioPlaying = false;
        this.currentPlayingQuestion.currentAudioTime = '0:00';
      }
      this.currentAudio = null;
      this.currentPlayingQuestion = null;
    }
  }

  private formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  getAudioUrl(file: File): string {
    return URL.createObjectURL(file);
  }
}
