import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { HeaderService } from '../../core/services/header-services/header.service';
import { Classes, ClassesData } from '../../core/models/header-models/header.model';
import { SharedService } from '../../core/services/shared-services/shared.service';
import { LoginService } from '../../core/services/login-services/login.service';
import { ClassesEnum } from '../../core/models/shared-models/enums';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {

  selectedGradeId: number;
  selectedSubjectId: number;
  selectedSectionId: number;
  classesEnum = ClassesEnum;
  constructor(private loginService: LoginService, private headerService: HeaderService, private sharedService: SharedService) { }

  notificationCount: number = 3; // Example notification count
  userName: string = 'Laila Aslama';
  position: string = 'Teacher';
  classesData: ClassesData = new ClassesData();

  dropdownOpen: boolean = false; // Track dropdown visibility
  displayFilter: string = 'Select filters'; // Initializes the display filter

  ngOnInit(): void {
    this.getClasses();
  }

  getClasses() {
    let model: Classes = {
      gradeId: this.headerService.selectedGradeId ? this.headerService.selectedGradeId : 0 ,
      roleId: parseInt(localStorage.getItem('roleId')),
      subjectId: this.headerService.selectedSubjectId ? this.headerService.selectedSubjectId : 0
    }
    this.headerService.getClasses(model).subscribe(res => {
      if (res.success) {
        this.classesData = res.result
        
        const selectedGrade = this.classesData.grades.find(grade => grade.isSelected);
        this.selectedGradeId = selectedGrade ? selectedGrade.gradeId : null;
        this.headerService.selectedGradeId = selectedGrade.gradeId;

        const selectedSubject = this.classesData.subjects.find(subject => subject.isSelected);
        this.selectedSubjectId = selectedSubject ? selectedSubject.subjectId : null;
        this.headerService.selectedSubjectId = selectedSubject.subjectId;

        const selectedSection = this.classesData.courseSections.find(section => section.isSelected);
        this.selectedSectionId = selectedSection ? selectedSection.courseSectionId : null;
        this.headerService.selectedSectionId = selectedSection.courseSectionId;

        this.displayFilter = `${selectedGrade.name} , ${selectedSubject.name}`
        this.sharedService.triggerRefresh(res);
      }
    })
  }

  // Method to apply the filter
  applyFilter($event) {
    $event.stopPropagation();
    this.dropdownOpen = false; // Optionally close after applying the filter
    this.sharedService.triggerRefresh('trigger');
  }

  // Method to clear all selections
  clearAll($event) {
    $event.stopPropagation();
    this.displayFilter = 'Select filters'; // Reset display filter
    this.dropdownOpen = false; // Optionally close on clear
  }

  // Update dropdown title dynamically (may not be necessary)
  updateDropdownTitle(id:number , classesEnum : ClassesEnum) {
    if(this.classesEnum.subject == classesEnum){
      this.headerService.selectedSubjectId = id;
      this.headerService.selectedGradeId = 0;
    }else if(this.classesEnum.grade == classesEnum){
      this.headerService.selectedGradeId = id;
    }else{
      this.headerService.selectedSectionId = id;
    }
  }

  // Toggle dropdown visibility
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen; // Toggle the dropdown state
  }

  logout() {
    this.loginService.logout();
  }
}
