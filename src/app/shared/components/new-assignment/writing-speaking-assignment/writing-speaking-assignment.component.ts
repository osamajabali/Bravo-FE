import { Component, computed, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';

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
}

@Component({
  selector: 'app-writing-speaking-assignment',
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    RadioButtonModule
  ],
  templateUrl: './writing-speaking-assignment.component.html',
  styleUrl: './writing-speaking-assignment.component.scss',
})
export class WritingSpeakingAssignmentComponent implements OnInit {
  @Input() type: string = '';
  @Input() questions: Question[] = [];
  @Output() questionsChange = new EventEmitter<Question[]>();

  title = computed(() =>
    this.type === 'writing'
      ? 'Writing Assignment'
      : 'Speaking Assignment Details'
  );

  private nextQuestionId = 2;

  ngOnInit() {
    // Initialize with default question if no questions provided
    if (this.questions.length === 0) {
      this.questions = [
        {
          id: 1,
          questionText: '',
          questionFormat: 'text',
          description: '',
          answerType: 'keyboard',
          isCollapsed: false
        }
      ];
      this.emitQuestionsChange();
    } else {
      // Set nextQuestionId based on existing questions
      this.nextQuestionId = Math.max(...this.questions.map(q => q.id)) + 1;
    }
  }

  private emitQuestionsChange() {
    this.questionsChange.emit([...this.questions]);
  }

  addQuestion() {
    const newQuestion: Question = {
      id: this.nextQuestionId++,
      questionText: '',
      questionFormat: 'text',
      description: '',
      answerType: 'keyboard',
      isCollapsed: false
    };
    this.questions.push(newQuestion);
    this.emitQuestionsChange();
  }

  removeQuestion(questionId: number) {
    this.questions = this.questions.filter(q => q.id !== questionId);
    this.emitQuestionsChange();
  }

  toggleCollapse(question: Question) {
    question.isCollapsed = !question.isCollapsed;
    this.emitQuestionsChange();
  }

  onQuestionFormatChange(question: Question, format: 'text' | 'image' | 'voice' | 'video') {
    question.uploadedImageFile = undefined;
    question.uploadedImageFileName = undefined;
    question.uploadedImageFileSize = undefined;
    question.imageFileValidation = undefined;
    question.uploadedVoiceFile = undefined;
    question.uploadedVoiceFileName = undefined;
    question.uploadedVoiceFileSize = undefined;
    question.voiceFileValidation = undefined;
    question.questionFormat = format;
    // Reset answer type based on format
    if (format === 'text' || format === 'video') {
      question.answerType = 'keyboard';
    } else if (format === 'image') {
      question.answerType = 'keyboard';
    } else if (format === 'voice') {
      question.answerType = 'keyboard';
    }
    this.emitQuestionsChange();
  }

  onFileUpload(event: any, question: Question) {
    const file = event.target.files[0];
    if (file) {
      if (question.questionFormat === 'image') {
        const validation = this.validateImageFile(file);
        question.uploadedImageFile = file;
        question.uploadedImageFileName = file.name;
        question.uploadedImageFileSize = this.formatFileSize(file.size);
        question.imageFileValidation = validation;
        this.emitQuestionsChange();
      } else if (question.questionFormat === 'voice') {
        this.validateAudioFileAsync(file).then(validation => {
          question.uploadedVoiceFile = file;
          question.uploadedVoiceFileName = file.name;
          question.uploadedVoiceFileSize = this.formatFileSize(file.size);
          question.voiceFileValidation = validation;
          this.emitQuestionsChange();
        });
      }
    }
  }

  private validateFile(file: File, format: 'text' | 'image' | 'voice' | 'video'): { isValid: boolean; errorMessage?: string } {
    if (format === 'image') {
      return this.validateImageFile(file);
    } else if (format === 'voice') {
      return this.validateAudioFile(file);
    }
    return { isValid: true };
  }

  private validateImageFile(file: File): { isValid: boolean; errorMessage?: string } {
    // Check file format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedFormats.includes(file.type.toLowerCase())) {
      return { isValid: false, errorMessage: 'Invalid format. Only JPG, PNG, JPEG are allowed.' };
    }

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return { isValid: false, errorMessage: 'File size exceeds 5MB limit.' };
    }

    // For image dimensions, we would need to load the image to check
    // For now, we'll validate format and size only
    return { isValid: true };
  }

  private validateAudioFile(file: File): { isValid: boolean; errorMessage?: string } {
    // Check file format
    if (!file.type.includes('audio/mpeg') && !file.type.includes('audio/mp3')) {
      return { isValid: false, errorMessage: 'Invalid format. Only MP3 files are allowed.' };
    }

    return { isValid: true };
  }

  private async validateAudioFileAsync(file: File): Promise<{ isValid: boolean; errorMessage?: string }> {
    // Check file format first
    if (!file.type.includes('audio/mpeg') && !file.type.includes('audio/mp3')) {
      return { isValid: false, errorMessage: 'Invalid format. Only MP3 files are allowed.' };
    }

    // Check duration
    try {
      const duration = await this.getAudioDuration(file);
      const maxDurationMinutes = 5;
      const maxDurationSeconds = maxDurationMinutes * 60;

      if (duration > maxDurationSeconds) {
        return { isValid: false, errorMessage: `Audio duration exceeds ${maxDurationMinutes} minutes limit.` };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, errorMessage: 'Unable to validate audio file.' };
    }
  }

  private getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      const objectUrl = URL.createObjectURL(file);

      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(objectUrl);
        resolve(audio.duration);
      });

      audio.addEventListener('error', () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load audio file'));
      });

      audio.src = objectUrl;
    });
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  removeUploadedFile(question: Question, fileType: 'image' | 'voice') {
    if (fileType === 'image') {
      question.uploadedImageFile = undefined;
      question.uploadedImageFileName = undefined;
      question.uploadedImageFileSize = undefined;
      question.imageFileValidation = undefined;
    } else if (fileType === 'voice') {
      question.uploadedVoiceFile = undefined;
      question.uploadedVoiceFileName = undefined;
      question.uploadedVoiceFileSize = undefined;
      question.voiceFileValidation = undefined;
    }
    this.emitQuestionsChange();
  }

  getImagePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  // Add method to handle question text changes
  onQuestionTextChange() {
    this.emitQuestionsChange();
  }

  // Add method to handle description changes
  onDescriptionChange() {
    this.emitQuestionsChange();
  }

  // Add method to handle answer type changes
  onAnswerTypeChange() {
    this.emitQuestionsChange();
  }

  // Add method to handle video URL changes
  onVideoUrlChange() {
    this.emitQuestionsChange();
  }
}
