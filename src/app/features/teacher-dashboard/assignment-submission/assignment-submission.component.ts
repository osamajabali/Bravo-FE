import { Component, inject, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, NgZone } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SubmissionService } from '../../../core/services/assignment/submission.service';
import {
  StudentSubmission,
  SubmissionQuestion,
} from '../../../core/models/assignment/student-submission.model';
import { MultipleQuestionsComponent } from '../../../shared/components/assignment-submissions/multiple-questions/multiple-questions.component';
import { BookReadingComponent } from '../../../shared/components/assignment-submissions/book-reading/book-reading.component';
import { BookPageSummaryRecordingComponent } from '../../../shared/components/assignment-submissions/book-page-summary-recording/book-page-summary-recording.component';
import { StudentMarkingDrawerComponent } from '../../../shared/components/student-marking-drawer/student-marking-drawer.component';
import { BookListeningComponent } from '../../../shared/components/assignment-submissions/book-listening/book-listening.component';
import { QuestionAnswerComponent } from '../../../shared/components/assignment-submissions/question-answer/question-answer.component';
import { MediaPlayerComponent, MediaFile } from '../../../shared/components/media-player/media-player.component';

enum SubmissionType {
  MULTIPLE_QUESTIONS = 'multiple-questions',
  BOOK_READING = 'book-reading',
  BOOK_PAGE_SUMMARY_RECORDING = 'book-page-summary-recording',
  BOOK_LISTENING = 'book-listening',
  QUESTION_ANSWER = 'question-answer'
}

interface Question {
  id: number;
  text: string;
  difficulty: 'Beginner' | 'Medium' | 'Advanced';
  studentAnswers: {
    correct: number;
    wrong: number;
  };
}

@Component({
  selector: 'app-assignment-submission',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    MultipleQuestionsComponent,
    BookReadingComponent,
    BookPageSummaryRecordingComponent,
    StudentMarkingDrawerComponent,
    BookListeningComponent,
    QuestionAnswerComponent,
    DialogModule,
    MediaPlayerComponent,
  ],
  templateUrl: './assignment-submission.component.html',
  styleUrl: './assignment-submission.component.scss',
})
export class AssignmentSubmissionComponent implements OnInit, OnDestroy {
  @ViewChild(MultipleQuestionsComponent)
  multipleQuestionsComponent!: MultipleQuestionsComponent;

  showMarkingDrawer = false;
  showFeedbackPopup = false;
  todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  // Voice recording properties
  isRecording = false;
  recordingTime = 0;
  recordingInterval: any;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  recordedAudioFile: MediaFile | null = null;
  audioVisualizationData: number[] = [];
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  animationId: number | null = null;
  voiceActivityHistory: number[] = []; // Store voice activity per second
  currentSecondActivity = 0; // Current second's voice activity
  lastSecond = 0;

  // Make enum accessible in template
  SubmissionType = SubmissionType;

  sharedService = inject(SharedService);
  submissionService = inject(SubmissionService);
  cdr = inject(ChangeDetectorRef);
  ngZone = inject(NgZone);

  studentSubmission: StudentSubmission = new StudentSubmission();
  questions: SubmissionQuestion[] = [];
  studentId: number;
  submissionId: number;
  submissionType: SubmissionType = SubmissionType.BOOK_PAGE_SUMMARY_RECORDING;

  ngOnInit(): void {
    this.sharedService.pushTitle('ASSIGNMENT SUBMISSION');
    if (
      localStorage.getItem('submissionId') &&
      localStorage.getItem('studentId')
    ) {
      this.submissionId = parseInt(localStorage.getItem('submissionId'));
      this.studentId = parseInt(localStorage.getItem('studentId'));
      this.getSubmissions();
    }
  }

  getSubmissions() {
    this.submissionService
      .getStudentSubmission(this.submissionId, this.studentId)
      .subscribe((res) => {
        if (res.success) {
          this.studentSubmission = res.result;
          // Trigger the first skill to be expanded and load its questions
          if (this.studentSubmission.skills.length > 0) {
            // Use setTimeout to ensure the child component is initialized
            setTimeout(() => {
              this.multipleQuestionsComponent?.toggleSkill(
                this.studentSubmission.skills[0].skillId
              );
            });
          }
        }
      });
  }

  hasWrongAnswer(question: Question): boolean {
    return question.studentAnswers.wrong > 0;
  }

  hasOnlyCorrectAnswers(question: Question): boolean {
    return (
      question.studentAnswers.correct > 0 && question.studentAnswers.wrong === 0
    );
  }

  correctSubmission() {
    this.showMarkingDrawer = true;
  }

  closeFeedbackPopup() {
    this.showFeedbackPopup = false;
  }

  async startRecording() {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize audio context for visualization
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(stream);
      source.connect(this.analyser);
      
      this.analyser.fftSize = 256;
      const bufferLength = this.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Start recording
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
        
        this.recordedAudioFile = {
          file: audioFile,
          fileName: audioFile.name,
          fileSize: this.formatFileSize(audioFile.size),
          isPlaying: false,
          currentTime: '0:00',
          progress: 0
          // Let MediaPlayer determine duration and durationSeconds from the actual audio file
        };
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
        
        // Trigger change detection to update the UI
        this.cdr.detectChanges();
      };
      
      // Start recording with timeslice to ensure data is available
      this.mediaRecorder.start(1000); // Collect data every second
      this.isRecording = true;
      this.recordingTime = 0;
      this.voiceActivityHistory = [];
      this.currentSecondActivity = 0;
      this.lastSecond = 0;
      
      // Start recording timer
      this.recordingInterval = setInterval(() => {
        this.recordingTime++;
        // Store the average activity for the completed second
        this.voiceActivityHistory.push(this.currentSecondActivity);
        this.currentSecondActivity = 0;
      }, 1000);
      
      // Start audio visualization
      this.visualizeAudio(dataArray);
      
    } catch (error) {
      alert('Unable to access microphone. Please check your permissions.');
    }
  }

  stopRecording() {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      
      // Clear recording timer
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval);
        this.recordingInterval = null;
      }
      
      // Stop audio visualization
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
      
      // Close audio context
      if (this.audioContext) {
        this.audioContext.close();
        this.audioContext = null;
      }
    }
  }

  acceptRecording() {    
          // Create the audio file immediately instead of waiting for onstop
      if (this.audioChunks.length > 0) {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
      
      this.recordedAudioFile = {
        file: audioFile,
        fileName: audioFile.name,
        fileSize: this.formatFileSize(audioFile.size),
        isPlaying: false,
        currentTime: '0:00',
        progress: 0
        // Let MediaPlayer determine duration and durationSeconds from the actual audio file
      };
      
    }
    
    this.stopRecording();
    
    // Use NgZone to ensure Angular detects the changes
    this.ngZone.run(() => {
      this.cdr.detectChanges();
      console.log('State after accept:', {
        isRecording: this.isRecording,
        recordedAudioFile: !!this.recordedAudioFile
      });
    });
  }

  rejectRecording() {
    this.stopRecording();
    this.recordedAudioFile = null;
    this.recordingTime = 0;
    this.audioVisualizationData = [];
    this.voiceActivityHistory = [];
    this.currentSecondActivity = 0;
  }

  private visualizeAudio(dataArray: Uint8Array) {
    if (!this.analyser || !this.isRecording) return;
    
    this.analyser.getByteFrequencyData(dataArray);
    
    // Calculate current voice activity level with better voice detection
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    
    // Use a more sensitive threshold for voice detection
    const voiceThreshold = 20; // Minimum level to consider as voice
    const isVoiceDetected = average > voiceThreshold;
    
    // Calculate normalized activity level
    let normalizedActivity;
    if (isVoiceDetected) {
      // Scale voice activity from 30% to 90% when speaking
      normalizedActivity = Math.min(90, Math.max(30, (average / 255) * 90 + 30));
    } else {
      // Keep bars consistently low when silent (no random movement)
      normalizedActivity = 15;
    }
    
    // Update current second's activity (take the maximum activity in this second)
    this.currentSecondActivity = Math.max(this.currentSecondActivity, normalizedActivity);
    
    // Create visualization data showing voice activity history per second
    this.audioVisualizationData = [
      ...this.voiceActivityHistory, // Past seconds
      this.currentSecondActivity || 15 // Current second
    ];
    
    // Limit to show last 20 seconds max
    if (this.audioVisualizationData.length > 20) {
      this.audioVisualizationData = this.audioVisualizationData.slice(-20);
    }
    
    this.animationId = requestAnimationFrame(() => this.visualizeAudio(dataArray));
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onMediaFileChange(updatedMediaFile: MediaFile) {
    if (this.recordedAudioFile) {
      this.recordedAudioFile = { ...this.recordedAudioFile, ...updatedMediaFile };
      console.log('Media file updated:', {
        currentTime: updatedMediaFile.currentTime,
        duration: updatedMediaFile.duration,
        progress: updatedMediaFile.progress,
        durationSeconds: updatedMediaFile.durationSeconds
      });
    }
  }

  ngOnDestroy() {
    // Clean up recording resources
    this.rejectRecording();
  }
}
