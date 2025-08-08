import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CustomStepsComponent } from '../../../shared/components/custom-steps/custom-steps.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentTypeSelectorComponent } from '../../../shared/components/new-assignment/assignment-type-selector/assignment-type-selector.component';
import { AssignmentSetupComponent } from '../../../shared/components/new-assignment/assignment-setup/assignment-setup.component';
import { AssignmentDomainsAndSkillsComponent, Domain } from '../../../shared/components/new-assignment/assignment-domains-and-skills/assignment-domains-and-skills.component';
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
import { AssignmentAddTypesEnum } from '../../../core/models/shared-models/enums';
import { AddingAssignmentService } from '../../../core/services/assignment/adding-assignment.service';
import { AssignmentPayload } from '../../../core/models/assignment/assignment-payload';
import { AssignmentSetup } from '../../../core/models/assignment/assignment-setup.model';
import { LoginService } from '../../../core/services/login-services/login.service';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Role } from '../../../core/models/login-models/logged-in-user';
import { AssignmentReading } from '../../../core/models/assignment/assignment-reading.model';
import { AssignmentReadingPayload } from '../../../core/models/assignment/assignment-stories.model';
import { OralAssignmentPayload } from '../../../core/models/assignment/assignment-oral.model';
import { AssignmentListening } from '../../../core/models/assignment/assignment-listening.model';

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
  @ViewChild('assignmentTypeSelector') assignmentTypeSelector: AssignmentTypeSelectorComponent;

  isSetupValid: boolean = true;
  activeStep: number = 0;
  selectedAssignmentType: AssignmentTypes | null = null;
  isReviewPage: boolean = false;
  showSuccessDialog: boolean = false;
  AssignmentAddTypesEnum = AssignmentAddTypesEnum;
  addingAssignmentService = inject(AddingAssignmentService);
  loginService = inject(LoginService);
  headerService = inject(HeaderService);
  assignment: AssignmentPayload = new AssignmentPayload();
  assignmentSetup: AssignmentSetup = new AssignmentSetup();
  assignmentDomain: Domain[] = [];
  assignmentReading: AssignmentReading = new AssignmentReading();
  assignmentListening: AssignmentListening = new AssignmentListening();
  OralAssignmentPayload: OralAssignmentPayload = new OralAssignmentPayload();
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
  roles: Role[] = [];
  callApi: boolean = false;

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

  selectedOptions: {
    isShowCorrectAnswer: boolean;
    isSameQuestionsForAllStudents: boolean;
  } = {
      isShowCorrectAnswer: false,
      isSameQuestionsForAllStudents: false
    };
  assignmentBook: AssignmentReadingPayload = new AssignmentReadingPayload()

  ngOnInit(): void {
    this.sharedService.pushTitle('Back to Assignments');
  }

  onQuestionsChange(questions: Question[]) {
    this.writingSpeakingQuestions = questions;
  }

  checkValidity($event: boolean) {
    this.isSetupValid = $event;
  }

  previewAssignment() { }

  next() {
    if(this.activeStep == 0){
      this.assignmentTypeSelector.selectAssignmentType(this.selectedAssignmentType);
    }
    if (this.activeStep === Number(this.items[this.items.length - 1].id)) {
      this.isReviewPage = true;
    }
    this.activeStep = this.activeStep + 1;

    this.updateStepsCompletion();
  }

  back() {
    this.activeStep = this.activeStep - 1;

    this.isReviewPage = false;
    if(this.activeStep == 0){
      this.callApi = true;
    }
    this.updateStepsCompletion();
  }

  submit() {
    this.assignmentSetup = JSON.parse(localStorage.getItem('assignmentSetup'));
    if (localStorage.getItem('AssignmentDomainsAndSkills')) {
      this.assignmentDomain = JSON.parse(localStorage.getItem('AssignmentDomainsAndSkills'));
    }
    if (localStorage.getItem('assignmentBookReading')) {
      this.assignmentBook = JSON.parse(localStorage.getItem('assignmentBookReading'));
    }
    if (localStorage.getItem('assignmentBookReading')) {
      this.selectedOptions = JSON.parse(localStorage.getItem('SkillsSelectedOptions'));
    }

    this.roles = JSON.parse(localStorage.getItem('loginRoles')) as Role[];
    if (this.selectedAssignmentType.assignmentTypeId == this.AssignmentAddTypesEnum.Skills) {
      this.addAssigmentSkill();
    } else if (this.selectedAssignmentType.assignmentTypeId == this.AssignmentAddTypesEnum.ReadingComprehension) {
      this.addAssignmentReading();
    } else if (this.selectedAssignmentType.assignmentTypeId == this.AssignmentAddTypesEnum.OralReading) {
      this.addAssignmentOralReading();
    }else if (this.selectedAssignmentType.assignmentTypeId == this.AssignmentAddTypesEnum.Listening) {
      this.addAssignmentListening();
    }
  }

  addAssigmentSkill() {
    this.assignment = {
      assignmentTypeId: this.selectedAssignmentType.assignmentTypeId,
      dueDate: this.assignmentSetup.dueDate,
      isSameQuestionsForAllStudents: this.selectedOptions.isSameQuestionsForAllStudents,
      isShowCorrectAnswer: this.selectedOptions.isShowCorrectAnswer,
      recipientTypeId: this.assignmentSetup.target.assignmentRecipientTypeId.toString(),
      schoolId: this.roles[0].schools[0].schoolId,
      selectedDomains: this.assignmentDomain.map(domain => ({
        domainId: domain.domainId,
        skills: domain.updatedSkills
      })),
      selectedGrades: this.assignmentSetup.selectedGrades,
      selectedGroups: this.assignmentSetup.selectedGroups,
      selectedCourseSections: this.assignmentSetup.selectedSections,
      selectedStudents: this.assignmentSetup.selectedStudents,
      startDate: this.assignmentSetup.startDate,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
      title: this.assignmentSetup.title,
      totalSelectedQuestions: this.getDomainsTotal(),
      roleId: this.roles[0].roleId
    };
    this.addingAssignmentService.addAssignment(this.assignment).subscribe(res => {
      if (res.success) {
        this.showSuccessDialog = true;
      }
    })
  }

  getDomainsTotal = (): number => {
    let domainTotal: number = 0;
    this.assignmentDomain.forEach(domain => {
      domainTotal += domain.totalQuestions;
    })
    return domainTotal;
  }

  addAssignmentReading() {
    this.assignmentReading = {
      assignmentTypeId: this.selectedAssignmentType.assignmentTypeId,
      dueDate: this.assignmentSetup.dueDate,
      bookSelectionCriteria: this.assignmentBook.bookSelectionCreteria,
      recipientTypeId: this.assignmentSetup.target.assignmentRecipientTypeId.toString(),
      schoolId: this.roles[0].schools[0].schoolId,
      selectedBookId: this.assignmentBook.book ? this.assignmentBook.book.storyId : 0,
      selectedGrades: this.assignmentSetup.selectedGrades,
      selectedGroups: this.assignmentSetup.selectedGroups,
      selectedReadingSubLevelId: this.assignmentBook.assignmentStories.readingSubLevelId,
      selectedCourseSections: this.assignmentSetup.selectedSections,
      selectedStudents: this.assignmentSetup.selectedStudents,
      startDate: this.assignmentSetup.startDate,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
      title: this.assignmentSetup.title,
      roleId: this.roles[0].roleId
    }
    if (this.selectedAssignmentType.assignmentTypeId == this.AssignmentAddTypesEnum.ReadingComprehension) {
      this.addingAssignmentService.addAssignmentReading(this.assignmentReading).subscribe(res => {
        if (res.success) {
          this.showSuccessDialog = true;
          this.isReviewPage = false;
        }
      })
    }
  }

  addAssignmentListening() {
    this.assignmentListening = {
      assignmentTypeId: this.selectedAssignmentType.assignmentTypeId,
      dueDate: this.assignmentSetup.dueDate,
      recipientTypeId: this.assignmentSetup.target.assignmentRecipientTypeId.toString(),
      schoolId: this.roles[0].schools[0].schoolId,
      selectedBookId: this.assignmentBook.book ? this.assignmentBook.book.storyId : 0,
      selectedGrades: this.assignmentSetup.selectedGrades,
      selectedGroups: this.assignmentSetup.selectedGroups,
      selectedReadingSubLevelId: this.assignmentBook.assignmentStories.readingSubLevelId,
      selectedCourseSections: this.assignmentSetup.selectedSections,
      selectedStudents: this.assignmentSetup.selectedStudents,
      startDate: this.assignmentSetup.startDate,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
      title: this.assignmentSetup.title,
      roleId: this.roles[0].roleId
    }
    if (this.selectedAssignmentType.assignmentTypeId == this.AssignmentAddTypesEnum.Listening) {
      this.addingAssignmentService.addAssignmentListeningReading(this.assignmentListening).subscribe(res => {
        if (res.success) {
          this.showSuccessDialog = true;
        }
      })
    }
  }

  addAssignmentOralReading() {
    this.OralAssignmentPayload = {
      assignmentTypeId: this.selectedAssignmentType.assignmentTypeId,
      dueDate: this.assignmentSetup.dueDate,
      recipientTypeId: this.assignmentSetup.target.assignmentRecipientTypeId.toString(),
      schoolId: this.roles[0].schools[0].schoolId,
      selectedBookId: this.assignmentBook.book ? this.assignmentBook.book.storyId : 0,
      selectedGrades: this.assignmentSetup.selectedGrades,
      selectedGroups: this.assignmentSetup.selectedGroups,
      selectedReadingSubLevelId: this.assignmentBook.assignmentStories.readingSubLevelId,
      selectedCourseSections: this.assignmentSetup.selectedSections,
      selectedStudents: this.assignmentSetup.selectedStudents,
      startDate: this.assignmentSetup.startDate,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
      title: this.assignmentSetup.title,
      roleId: this.roles[0].roleId,
      correctionType : this.assignmentBook.correctionType,
      selectedPagesId :[0]
    }
    if (this.selectedAssignmentType.assignmentTypeId == this.AssignmentAddTypesEnum.OralReading) {
      this.addingAssignmentService.addAssignmentOralReading(this.OralAssignmentPayload).subscribe(res => {
        if (res.success) {
          this.showSuccessDialog = true;
          this.isReviewPage = false;
          this.activeStep = 0;
        }
      })
    }
  }

  onAssignmentDetails() {
    this.showSuccessDialog = false;
    // Navigate to assignment details page
  }

  onConfirm() {
    this.showSuccessDialog = false;
    this.router.navigate(['/features/assignments'])
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
