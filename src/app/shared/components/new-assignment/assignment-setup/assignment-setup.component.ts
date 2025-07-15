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
import { AssignmentSetup, SchoolRoleSubject } from '../../../../core/models/assignment/assignment-setup.model';
import { SharedService } from '../../../../core/services/shared-services/shared.service';
import { Subscription } from 'rxjs';
import { Role } from '../../../../core/models/login-models/logged-in-user';

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
  sections: { courseSectionId: number; name: string; }[] = [];
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
          this.getLookups();
        }
      }
    });
  }

  getLookups() {
    let roles = JSON.parse(localStorage.getItem('loginRoles')) as Role[];
    let assignmentGrades: SchoolRoleSubject = {
      roleId: roles[0].roleId,
      schoolId: roles[0].schools[0].schoolId,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
      gradeIds: []
    }
    this.addingAssignmentService.getAssignmentGrades(assignmentGrades).subscribe(res => {
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
          if (this.assignmentSetup.selectedGrades && (this.assignmentSetup.target.assignmentRecipientTypeId == this.targetEnum.Sections || this.assignmentSetup.target.assignmentRecipientTypeId == this.targetEnum.Students)) {
            this.getSections()
          }

          if (this.assignmentSetup.selectedGroups && this.assignmentSetup.target.assignmentRecipientTypeId == this.targetEnum.Groups) {
            this.getGroups()
          }

          if (this.assignmentSetup.selectedStudents && this.assignmentSetup.target.assignmentRecipientTypeId == this.targetEnum.Students) {
            this.getStudents()
          }
          this.isSetupValid.emit(false);
        } else {
          this.targets.find(x => x.name == 'Grades').selected = true;
        }
      }
    })
  }

  toggleSelected(target: AssignmentRecipientTypes): void {
    if (target.selected) return;

    this.assignmentSetup.selectedSections = [];
    this.assignmentSetup.selectedStudents = [];
    this.assignmentSetup.selectedGroups = [];
    this.assignmentSetup.selectedGradesNames = [];
    this.sections = [];

    let retrievedData: AssignmentSetup = JSON.parse(localStorage.getItem('assignmentSetup'));

    if (target.assignmentRecipientTypeId == this.targetEnum.Sections) {
      this.assignmentSetup.selectedSections = retrievedData ? retrievedData.selectedSections : [];
      this.isSetupValid.emit(this.assignmentSetup.selectedSections.length == 0);
      this.getSections();
    }

    if (target.assignmentRecipientTypeId == this.targetEnum.Groups) {
      this.assignmentSetup.selectedGroups = retrievedData ? retrievedData.selectedGroups : [];
      this.isSetupValid.emit(this.assignmentSetup.selectedGroups.length == 0);
      this.getGroups();
    }

    if (target.assignmentRecipientTypeId == this.targetEnum.Students) {
      this.assignmentSetup.selectedSections = retrievedData ? retrievedData.selectedSections : [];
      this.assignmentSetup.selectedStudents = retrievedData ? retrievedData.selectedStudents : [];
      this.isSetupValid.emit(this.assignmentSetup.selectedStudents.length == 0);
      this.getStudents();
      this.getSections();
    }

    this.targets.forEach(t => t.selected = false);
    this.selectedTarget = target;
    this.assignmentSetup.target = this.selectedTarget;
    target.selected = true;

  }

  getSections = () => {
    this.sections = [];
    if(this.assignmentSetup.selectedGrades.length == 0) return;
    let roles = JSON.parse(localStorage.getItem('loginRoles')) as Role[];
    let assignmentGrades: SchoolRoleSubject = {
      roleId: roles[0].roleId,
      schoolId: roles[0].schools[0].schoolId,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
      gradeIds: this.assignmentSetup.selectedGrades
    }
    this.addingAssignmentService.getAssignmentSections(assignmentGrades).subscribe(res => {
      if (res.success) {
        this.sections = res.result;

        if (this.assignmentSetup.selectedSections) {
          // Remove section IDs from selectedSections where section name is null
          this.assignmentSetup.selectedSections = this.assignmentSetup.selectedSections.filter(id => {
            const section = this.sections.find(sec => sec.courseSectionId === id);
            return section && section.name !== null;
          });
        }
      }
    });
  }


  getGroups = () => {
    this.groups = [];
    if(this.assignmentSetup.selectedGrades.length == 0) return;
    let roles = JSON.parse(localStorage.getItem('loginRoles')) as Role[];
    let assignmentGrades: SchoolRoleSubject = {
      roleId: roles[0].roleId,
      schoolId: roles[0].schools[0].schoolId,
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId,
      gradeIds: this.assignmentSetup.selectedGrades
    }
    this.addingAssignmentService.getAssignmentGroups(assignmentGrades).subscribe(res => {
      if (res.success) {
        this.groups = res.result;
        if (this.assignmentSetup.selectedGroups) {
          this.assignmentSetup.selectedGroups = this.assignmentSetup.selectedGroups.filter(id => {
            const group = this.groups.find(g => g.groupId === id);
            return group && group.name !== null
          })
        }
      }
    })
  }

  getStudents = () => {
    this.students = [];
    if(this.assignmentSetup.selectedSections.length == 0) return;
    this.addingAssignmentService.getAssignmentStudents(this.assignmentSetup.selectedSections).subscribe(res => {
      if (res.success) {
        this.students = res.result;

        if (this.assignmentSetup.selectedStudents) {
          this.assignmentSetup.selectedStudents = this.assignmentSetup.selectedStudents.filter(id => {
            const student = this.students.find(s => s.studentId === id);
            return student && student.fullName !== null;
          });
        }
      }
    });
  }


  assignmentSetupUpdate = (setupForm: NgForm) => {
    if (this.assignmentSetup.title && this.assignmentSetup.title.length > 60) {
      this.assignmentSetup.title = this.assignmentSetup.title.substring(0, 60);
    }
    if (this.assignmentSetup.startDate > this.assignmentSetup.dueDate) {
      this.assignmentSetup.dueDate = this.assignmentSetup.startDate;
    }
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
