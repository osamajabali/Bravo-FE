import { Component, inject, OnInit } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CustomStepsComponent } from '../../../shared/components/custom-steps/custom-steps.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentTypeSelectorComponent } from '../../../shared/components/new-assignment/assignment-type-selector/assignment-type-selector.component';
import { AssignmentSetupComponent } from '../../../shared/components/new-assignment/assignment-setup/assignment-setup.component';
import { AssignmentInformation } from '../../../shared/models/assignment-information.model';
import { AssignmentDomainsAndSkillsComponent } from '../../../shared/components/new-assignment/assignment-domains-and-skills/assignment-domains-and-skills.component';
import { AssignmentBookComponent } from '../../../shared/components/new-assignment/assignment-book/assignment-book.component';
import { ListeningAssignmentBookComponent } from '../../../shared/components/new-assignment/listening-assignment-book/listening-assignment-book.component';

interface AssignmentType {
  name: string;
  icon: string;
  title: string;
}

export interface StepItem {
  id: string;
  label: string;
  isStepCompleted: boolean;
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
    ListeningAssignmentBookComponent
  ],
  templateUrl: './new-assignment.component.html',
  styleUrl: './new-assignment.component.scss',
})
export class NewAssignmentComponent implements OnInit {
  activeStep: number = 0;
  selectedAssignmentType: AssignmentType | null = null;
  assignmentInformation: AssignmentInformation = {
    target: null,
    grade: null,
    section: null,
    title: null,
    startDate: null,
    dueDate: null,
  };
  sharedService = inject(SharedService);
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

  previewAssignment() {}

  next() {
    if (this.activeStep === Number(this.items[this.items.length - 1].id)) {
      return;
    }
    this.activeStep = this.activeStep + 1;

    this.updateStepsCompletion();
  }

  back() {
    this.activeStep = this.activeStep - 1;

    this.updateStepsCompletion();
  }

  updateStepsCompletion() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].isStepCompleted = i < this.activeStep;
    }
  }
}
