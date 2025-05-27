import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import {
  AssignmentInformation,
  AssignmentTarget,
  AssignmentGrade,
  AssignmentSection,
} from '../../../../shared/models/assignment-information.model';

@Component({
  selector: 'app-assignment-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    CalendarModule,
  ],
  templateUrl: './assignment-setup.component.html',
  styleUrl: './assignment-setup.component.scss',
})
export class AssignmentSetupComponent implements OnInit {
  @Input() assignmentInformation: AssignmentInformation = {
    target: null,
    grade: null,
    section: null,
    title: null,
    startDate: null,
    dueDate: null,
  };
  @Output() assignmentInformationChange =
    new EventEmitter<AssignmentInformation>();

  targets: AssignmentTarget[] = [
    { id: 1, name: 'Grade 2' },
    { id: 2, name: 'Homerooms' },
    { id: 3, name: 'Groups' },
    { id: 4, name: 'Students' },
  ];

  grades: AssignmentGrade[] = [
    { id: 1, name: 'Grade 1' },
    { id: 2, name: 'Grade 2' },
    { id: 3, name: 'Grade 3' },
    { id: 4, name: 'Grade 4' },
    { id: 5, name: 'Grade 5' },
  ];

  sections: AssignmentSection[] = [
    { id: 1, name: 'Section A' },
    { id: 2, name: 'Section B' },
    { id: 3, name: 'Section C' },
    { id: 4, name: 'Section D' },
  ];

  homerooms = [{ id: 1, name: 'Item 1' }];
  groups = [{ id: 1, name: 'Item 1' }];
  students = [{ id: 1, name: 'Item 1' }];

  ngOnInit(): void {
    this.onTargetChange(this.targets[0]);
  }

  updateAssignmentInformation(updates: Partial<AssignmentInformation>) {
    this.assignmentInformation = {
      ...this.assignmentInformation,
      ...updates,
    };
    this.assignmentInformationChange.emit(this.assignmentInformation);
  }

  onTargetChange(target: AssignmentInformation['target']) {
    this.updateAssignmentInformation({ target });
  }

  onGradeChange(grade: AssignmentInformation['grade']) {
    this.updateAssignmentInformation({ grade });
  }

  onSectionChange(section: AssignmentInformation['section']) {
    this.updateAssignmentInformation({ section });
  }

  isTargetSelected(target: AssignmentTarget): boolean {
    return this.assignmentInformation.target?.id === target.id;
  }
}
