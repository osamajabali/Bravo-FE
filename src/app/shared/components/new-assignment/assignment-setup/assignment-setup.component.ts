import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { AddingAssignmentService } from '../../../../core/services/assignment/adding-assignment.service';
import { AssignmentRecipientTypes } from '../../../../core/models/assignment/assignment-types.model';
import { HeaderService } from '../../../../core/services/header-services/header.service';
import { TargetEnum } from '../../../../core/models/shared-models/enums';
import { AssignmentSetup } from '../../../../core/models/assignment/assignment-setup.model';
import { SharedService } from '../../../../core/services/shared-services/shared.service';
import { Subscription } from 'rxjs';

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

  @Output() isSetupValid = new EventEmitter<boolean>();

  addingAssignmentService = inject(AddingAssignmentService);
  headerService = inject(HeaderService);
  sharedService = inject(SharedService);
  targets: AssignmentRecipientTypes[] = [];
  selectedTarget: AssignmentRecipientTypes = new AssignmentRecipientTypes();
  grades: { gradeId: number; name: string; }[] = [];
  sections: { sectionId: number; name: string; }[] = [];
  groups: { groupId: number; name: string; }[] = [];
  students: { studentId: number; fullName: string; }[] = [];
  targetEnum = TargetEnum;
  assignmentSetup: AssignmentSetup = new AssignmentSetup();
  selectedGrades: { gradeId: number; name: string; }[] = [];

  ngOnInit(): void {
    this.getTargets();
  }


  getTargets() {
    this.isSetupValid.emit(true)
    this.addingAssignmentService.getAssignmentRecipientTypes().subscribe(res => {
      if (res.success) {
        this.targets = res.result;
        this.selectedTarget = this.targets.find(x => x.name == 'Grades');
        this.assignmentSetup.target = this.selectedTarget;
        if (this.targets.length) {
          this.getLookups()
        }
      }
    });
  }

  getLookups() {
    this.addingAssignmentService.getAssignmentGrades(this.headerService.selectedSubjectId).subscribe(res => {
      if (res.success) {
        this.grades = res.result;

        if (localStorage.getItem('assignmentSetup') && this.grades.length) {
          let retrievedData: AssignmentSetup = JSON.parse(localStorage.getItem('assignmentSetup'))
          this.selectedTarget = retrievedData.target;
          this.targets.find(x => x.assignmentRecipientTypeId == this.selectedTarget.assignmentRecipientTypeId).selected = true;
          this.toggleSelected(this.selectedTarget);
          retrievedData.startDate = new Date(retrievedData.startDate);
          retrievedData.dueDate = new Date(retrievedData.dueDate);
          this.assignmentSetup = retrievedData;
          this.getGroups();
          this.getSections();
          this.isSetupValid.emit(false);
        } else {
          this.targets.find(x => x.name == 'Grades').selected = true;
        }
      }
    })
  }

  toggleSelected(target: AssignmentRecipientTypes): void {
    this.assignmentSetup.selectedGroups = [];
    this.assignmentSetup.selectedSections = [];
    this.assignmentSetup.selectedStudents = [];
    this.assignmentSetup.selectedGradesNames = [];
    this.isSetupValid.emit(true)
    this.sections = [];
    if (target.selected) return;
    if(this.assignmentSetup.selectedGrades && (target.assignmentRecipientTypeId == this.targetEnum.Sections || target.assignmentRecipientTypeId == this.targetEnum.Students )){
      this.getSections()
    }

    if(this.assignmentSetup.selectedGrades && target.assignmentRecipientTypeId == this.targetEnum.Groups){
      this.getGroups()
    }
    
    this.targets.forEach(t => t.selected = false);
    this.selectedTarget = target;
    this.assignmentSetup.target = this.selectedTarget;
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

  assignmentSetupUpdate = (setupForm: NgForm) => {
    if (this.assignmentSetup.selectedGrades) {
      this.assignmentSetup.selectedGradesNames = this.grades.filter(x => this.assignmentSetup.selectedGrades.includes(x.gradeId)).map(x => x.name);
    } else {
      this.isSetupValid.emit(true)
    }
    localStorage.setItem('assignmentSetup', JSON.stringify(this.assignmentSetup));

    if (setupForm.invalid) {
      this.isSetupValid.emit(true)
    } else {
      this.isSetupValid.emit(false)
    }
  }

}
