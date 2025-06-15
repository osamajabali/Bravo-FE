import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { AddingAssignmentService } from '../../../../core/services/assignment/adding-assignment.service';
import { AssignmentRecipientTypes } from '../../../../core/models/assignment/assignment-types.model';
import { HeaderService } from '../../../../core/services/header-services/header.service';
import { TargetEnum } from '../../../../core/models/shared-models/enums';
import { AssignmentSetup } from '../../../../core/models/assignment/assignment-setup.model';

@Component({
  selector: 'app-assignment-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    InputTextModule,
    CalendarModule,
    MultiSelectModule
  ],
  templateUrl: './assignment-setup.component.html',
  styleUrl: './assignment-setup.component.scss',
})
export class AssignmentSetupComponent implements OnInit {

  addingAssignmentService = inject(AddingAssignmentService);
  headerService = inject(HeaderService);
  targets: AssignmentRecipientTypes[] = [];
  selectedTarget: AssignmentRecipientTypes = new AssignmentRecipientTypes();
  grades: { gradeId: number; name: string; }[] = [];
  sections: { sectionId: number; name: string; }[] = [];
  groups: { groupId: number; name: string; }[] = [];
  students: { studentId: number; fullName: string; }[] = [];
  targetEnum = TargetEnum;
  assignmentSetup : AssignmentSetup = new AssignmentSetup()
  selectedGrades : { gradeId: number; name: string; }[] = [];

  ngOnInit(): void {
    this.getTargets();
  }


  getTargets() {
    this.addingAssignmentService.getAssignmentRecipientTypes().subscribe(res => {
      if (res.success) {
        this.targets = res.result;
        this.targets.find(x => x.name == 'Grades').selected = true;
        this.selectedTarget = this.targets.find(x => x.name == 'Grades');
        this.getLookups()
      }
    });

  }

  getLookups() {
    this.addingAssignmentService.getAssignmentGrades(this.headerService.selectedSubjectId).subscribe(res => {
      if (res.success) {
        this.grades = res.result;
      }
    })
  }

  toggleSelected(target: AssignmentRecipientTypes): void {
    this.assignmentSetup.selectedGrades = [];
    this.sections = [];
    if (target.selected) return;

    this.targets.forEach(t => t.selected = false);
    this.selectedTarget = target;
    target.selected = true;
  }

  getSections = () => {
    this.sections = [];
    this.addingAssignmentService.getAssignmentSections(this.headerService.selectedSubjectId, this.assignmentSetup.selectedGrades).subscribe(res => {
      if (res.success) {
        this.sections = res.result;
      }
    })
  }

  getGroups = () => {
    this.groups = [];
    this.addingAssignmentService.getAssignmentGroups(this.headerService.selectedSubjectId, this.assignmentSetup.selectedGrades).subscribe(res => {
      if (res.success) {
        this.groups = res.result;
      }
    })
  }

  getStudents = () => {
    this.students = [];
    this.addingAssignmentService.getAssignmentStudents(this.assignmentSetup.selectedSections).subscribe(res => {
      if (res.success) {
        this.students = res.result;
      }
    })
  }

  assignmentSetupUpdate = () =>{
    this.assignmentSetup.selectedGradesNames = this.grades.filter(x => this.assignmentSetup.selectedGrades.includes(x.gradeId)).map(x => x.name);
    localStorage.setItem('assignmentSetup', JSON.stringify(this.assignmentSetup));
  }

}
