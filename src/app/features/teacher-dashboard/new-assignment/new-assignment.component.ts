import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CustomStepsComponent } from '../../../shared/components/custom-steps/custom-steps.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentTypeSelectorComponent } from '../../../shared/components/new-assignment/assignment-type-selector/assignment-type-selector.component';
import { AssignmentSetupComponent } from '../../../shared/components/new-assignment/assignment-setup/assignment-setup.component';
import { AssignmentDomainsAndSkillsComponent } from '../../../shared/components/new-assignment/assignment-domains-and-skills/assignment-domains-and-skills.component';
import { AssignmentBookComponent } from '../../../shared/components/new-assignment/assignment-book/assignment-book.component';
import { ListeningAssignmentBookComponent } from '../../../shared/components/new-assignment/listening-assignment-book/listening-assignment-book.component';
import { SkillsReviewComponent } from '../../../shared/components/new-assignment/skills-review/skills-review.component';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { AssignmentBookReviewComponent } from '../../../shared/components/new-assignment/book-assignment-review/assignment-book-review.component';
import { OralAssignmentBookComponent } from '../../../shared/components/new-assignment/oral-assignment-book/oral-assignment-book.component';
import { WritingSpeakingAssignmentComponent } from '../../../shared/components/new-assignment/writing-speaking-assignment/writing-speaking-assignment.component';
import { ReviewWritingSpeakingComponent } from '../../../shared/components/new-assignment/review-writing-speaking/review-writing-speaking.component';
import { AssignmentTypes } from '../../../core/models/assignment/assignment-types.model';
import { AssygnmentAddTypesEnum } from '../../../core/models/shared-models/enums';

export interface StepItem {
  id: string;
  label: string;
  isStepCompleted: boolean;
}

export interface Question {
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
  selector: 'app-new-assignment',
  imports: [
    CustomStepsComponent,
    ReactiveFormsModule,
    ButtonModule,
    CommonModule,
    FormsModule,
    AssignmentTypeSelectorComponent,
    AssignmentSetupComponent,
    AssignmentDomainsAndSkillsComponent,
    AssignmentBookComponent,
    ListeningAssignmentBookComponent,
    SkillsReviewComponent,
    DialogModule,
    AssignmentBookReviewComponent,
    OralAssignmentBookComponent,
    WritingSpeakingAssignmentComponent,
    ReviewWritingSpeakingComponent,
  ],
  templateUrl: './new-assignment.component.html',
  styleUrl: './new-assignment.component.scss',
})
export class NewAssignmentComponent implements OnInit {

  isSetupValid: boolean = false;
  activeStep: number = 0;
  selectedAssignmentType: AssignmentTypes | null = null;
  isReviewPage: boolean = false;
  showSuccessDialog: boolean = false;
  assygnmentAddTypesEnum = AssygnmentAddTypesEnum;

  // Shared data for writing/speaking assignments
  writingSpeakingQuestions: Question[] = [
    {
      id: 1,
      questionText: '',
      questionFormat: 'text',
      description: '',
      answerType: 'keyboard',
      isCollapsed: false
    }
  ];

  changeActiveStep(step: number) {
    
    this.activeStep = step;
    this.isReviewPage = false;
  }

  sharedService = inject(SharedService);
  private router = inject(Router);
  items: StepItem[] = [
    {
      id: '0',
      label: '',
      isStepCompleted: false,
    },
    {
      id: '1',
      label: '',
      isStepCompleted: false,
    },
    {
      id: '2',
      label: '',
      isStepCompleted: false,
    },
  ];

  ngOnInit(): void {
    this.sharedService.pushTitle('ADD NEW ASSIGNMENT');
  }

  onQuestionsChange(questions: Question[]) {
    this.writingSpeakingQuestions = questions;
  }

  checkValidity($event: boolean) {
    this.isSetupValid = $event;
  }

  previewAssignment() { }

  next() {
    if (this.activeStep === Number(this.items[this.items.length - 1].id)) {
      this.isReviewPage = true;
    }
    this.activeStep = this.activeStep + 1;

    this.updateStepsCompletion();
  }

  back() {
    this.activeStep = this.activeStep - 1;

    this.isReviewPage = false;
    this.updateStepsCompletion();
  }

  submit() {
    this.showSuccessDialog = true;
  }

  onAssignmentDetails() {
    this.showSuccessDialog = false;
    // Navigate to assignment details page
  }

  onConfirm() {
    this.showSuccessDialog = false;
    // Navigate to assignments list
  }

  updateStepsCompletion() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].isStepCompleted = i < this.activeStep;
    }
  }

  handleStepChange(step: number) {
    this.isReviewPage = false;
    this.activeStep = step;

    this.updateStepsCompletion();
  }
}
