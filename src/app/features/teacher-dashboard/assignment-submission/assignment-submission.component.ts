import { Component, inject, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, NgZone, signal } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';
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
import { MediaPlayerComponent } from '../../../shared/components/media-player/media-player.component';
import { SubmissionReadingDetails } from '../../../core/models/assignment-submission/reading-submission-details';
import { OralReadingComponent } from "../../../shared/components/assignment-submissions/oral-reading/oral-reading.component";
import { OralSubmissionDetails } from '../../../core/models/assignment-submission/oral-submission-details';
import { AssignmentAddTypesEnum } from '../../../core/models/shared-models/enums';

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
    OralReadingComponent,
    TranslateModule
],
  templateUrl: './assignment-submission.component.html',
  styleUrl: './assignment-submission.component.scss',
})
export class AssignmentSubmissionComponent implements OnInit, OnDestroy {

  @ViewChild('multipleQuestions') multipleQuestionComponent: MultipleQuestionsComponent;
  @ViewChild('oralReading') OralReadingComponent: OralReadingComponent;
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
  recordedAudioFile: any | null = null;
  audioVisualizationData: number[] = [];
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  animationId: number | null = null;
  voiceActivityHistory: number[] = []; // Store voice activity per second
  currentSecondActivity = 0; // Current second's voice activity

  sharedService = inject(SharedService);
  submissionService = inject(SubmissionService);
  cdr = inject(ChangeDetectorRef);
  ngZone = inject(NgZone);

  studentSubmission: StudentSubmission = new StudentSubmission();
  questions: SubmissionQuestion[] = [];
  studentId: number;
  submissionId: number;
  submissionType: AssignmentAddTypesEnum = AssignmentAddTypesEnum.Skills;
  submissionTypeValues = AssignmentAddTypesEnum;
  readingSubmissionDetails: SubmissionReadingDetails = new SubmissionReadingDetails();
  oralSubmissionDetails = signal<OralSubmissionDetails>(new OralSubmissionDetails());

  ngOnInit(): void {
    this.sharedService.pushTitle('ASSIGNMENT SUBMISSION');
    if (localStorage.getItem('submissionId') && localStorage.getItem('studentId')
    ) {
      this.submissionId = parseInt(localStorage.getItem('submissionId'));
      this.studentId = parseInt(localStorage.getItem('studentId'));
    }
    if (localStorage.getItem('assignmentSubmissionType')) {
      this.submissionType = parseInt(localStorage.getItem('assignmentSubmissionType'));
    }
    this.getSubmissions()
  }

  getSubmissionsByType() {
    if (this.submissionType == this.submissionTypeValues.ReadingComprehension) {
      this.getReadingSubmissionDetails();
    } else if (this.submissionType == this.submissionTypeValues.OralReading) {
      this.getOralReadingSubmissionDetails();
    }
  }

  getOralReadingSubmissionDetails() {
    this.submissionService.getOralReadingSubmissionDetails(this.submissionId, this.studentId).subscribe(res => {
      if (res.success) {
        this.oralSubmissionDetails.set(res.result);
        this.studentSubmission.submissionCards = this.oralSubmissionDetails().submissionSummary;
      }
    })
  }

  getReadingSubmissionDetails() {
    this.submissionService.getReadingSubmissionDetails(this.submissionId, this.studentId).subscribe(res => {
      if (res.success) {
        this.readingSubmissionDetails = res.result;
        this.studentSubmission.submissionCards = this.readingSubmissionDetails.submissionSummary;
      }
    })
  }

  getSubmissions() {
    this.submissionService
      .getStudentSubmission(this.submissionId, this.studentId)
      .subscribe((res) => {
        if (res.success) {
          this.studentSubmission = res.result;
          this.getSubmissionsByType()
          // Trigger the first skill to be expanded and load its questions
          if (this.studentSubmission.skills) {
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

      // Start recording timer
      this.recordingInterval = setInterval(() => {
        this.recordingTime++;
        // Store the average activity for the completed second
        this.voiceActivityHistory.push(this.currentSecondActivity);
        this.currentSecondActivity = 0;
      }, 1000);

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

  onMediaFileChange(updatedMediaFile: any) {
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
