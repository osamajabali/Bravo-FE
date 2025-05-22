import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { AssignmentInformation, AssignmentTarget, AssignmentGrade, AssignmentSection } from '../../../../shared/models/assignment-information.model';

@Component({
  selector: 'app-assignment-information',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule
  ],
  templateUrl: './assignment-information.component.html',
  styleUrl: './assignment-information.component.scss'
})
export class AssignmentInformationComponent {
  @Input() assignmentInformation: AssignmentInformation = {
    target: null,
    grade: null,
    section: null
  };
  @Output() assignmentInformationChange = new EventEmitter<AssignmentInformation>();

  targets: AssignmentTarget[] = [
    { id: 1, name: 'Grade 2' },
    { id: 2, name: 'Homerooms' },
    { id: 3, name: 'Groups' },
    { id: 4, name: 'Students' }
  ];

  grades: AssignmentGrade[] = [
    { id: 1, name: 'Grade 1' },
    { id: 2, name: 'Grade 2' },
    { id: 3, name: 'Grade 3' },
    { id: 4, name: 'Grade 4' },
    { id: 5, name: 'Grade 5' }
  ];

  sections: AssignmentSection[] = [
    { id: 1, name: 'Section A' },
    { id: 2, name: 'Section B' },
    { id: 3, name: 'Section C' },
    { id: 4, name: 'Section D' }
  ];

  updateAssignmentInformation(updates: Partial<AssignmentInformation>) {
    this.assignmentInformation = {
      ...this.assignmentInformation,
      ...updates
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

