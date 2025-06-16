import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';
import { QuestionPreviewPopupComponent } from '../../question-preview-popup/question-preview-popup.component';
import { AddingAssignmentService } from '../../../../core/services/assignment/adding-assignment.service';
import { AssignmentsDomain, AssignmentsDomainSkills, SkillsDomain, SkillsDomainResponse } from '../../../../core/models/assignment/assignment-domain.model';
import { AssignmentSetup } from '../../../../core/models/assignment/assignment-setup.model';
import { HeaderService } from '../../../../core/services/header-services/header.service';
import { SharedService } from '../../../../core/services/shared-services/shared.service';
import { json } from 'stream/consumers';
import { PaginationComponent } from "../../pagination/pagination.component";
import { PaginatorState } from 'primeng/paginator';

interface Skill {
  name: string;
  beginner: number;
  medium: number;
  advanced: number;
}

export interface Domain {
  id: number;
  selectedDomain?: string;
  searchText: string;
  skills: SkillsDomain[];
  skillDomains: { domainId: number; name: string; }[],
  isCollapsed: boolean;
  totalQuestions: number;
}

@Component({
  selector: 'app-assignment-domains-and-skills',
  imports: [
    FormsModule,
    RadioButtonModule,
    SelectModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    InputNumberModule,
    PanelModule,
    QuestionPreviewPopupComponent,
    PaginationComponent
  ],
  templateUrl: './assignment-domains-and-skills.component.html',
  styleUrl: './assignment-domains-and-skills.component.scss',
})
export class AssignmentDomainsAndSkillsComponent implements OnInit {
  addingAssignmentService = inject(AddingAssignmentService);
  headerService = inject(HeaderService);
  sharedService = inject(SharedService);
  selectedOption: string = '';
  domains: Domain[] = [{
    id: 1,
    searchText: '',
    skills: [],
    isCollapsed: false,
    skillDomains: [],
    totalQuestions: 0
  }];


  // Popup state
  showQuestionPreview: boolean = false;
  selectedSkillName: string = '';
  selectedDifficultyLevel: string = '';
  assignmentDomain: AssignmentsDomain = new AssignmentsDomain();
  skillDomains: { domainId: number; name: string; }[] = [];
  selectedSkillId: number;
  assignmentData: AssignmentSetup = new AssignmentSetup();
  skills: SkillsDomainResponse = new SkillsDomainResponse();
  searchValue: string = '';
  first: number = 0;
  assignmentsDomainSkills: AssignmentsDomainSkills = new AssignmentsDomainSkills();
  totalQuestions: number = 0;

  ngOnInit(): void {
    this.getDomains();
  }

  getDomains() {
    const retrievedData = localStorage.getItem('assignmentSetup');
    if (retrievedData) {
      this.assignmentData = JSON.parse(retrievedData);
      // this.assignmentDomain ={
      //   selectedGrades : assignmentData.selectedGrades,
      //   selectedGroups : assignmentData.selectedGroups,
      //   selectedSections : assignmentData.selectedSections,
      //   selectedStudents : assignmentData.selectedStudents,
      //   subjectId : this.headerService.selectedSubjectId
      // }
      this.assignmentDomain = {
        selectedGrades: [],
        selectedGroups: [945],
        selectedSections: [],
        selectedStudents: [],
        subjectId: 1
      }
    }

    this.addingAssignmentService.getAssignmentDomains(this.assignmentDomain).subscribe(res => {
      if (res.success) {
        this.skillDomains = res.result
        this.domains[0].skillDomains = this.skillDomains;
      }
    })
  }

  addDomain() {
    // Get all existing domainIds
    const existingDomainIds = this.domains.map(domain => domain.id);

    // Filter out the domainId from skillDomains that matches the previous domain IDs
    const newSkillDomains = this.domains[0].skillDomains.filter(skillDomain =>
      !existingDomainIds.includes(skillDomain.domainId)
    );

    // Add the new domain with the filtered skillDomains
    this.domains.push({
      id: this.domains.length + 1,
      searchText: '',
      skills: [],
      isCollapsed: false,
      skillDomains: newSkillDomains,
      totalQuestions: 0
    });

    this.updateValues();
    this.getDomainsTotal
  }


  removeDomain(id: number) {
    this.domains = this.domains.filter(domain => domain.id !== id);
  }

  toggleCollapse(domain: Domain) {
    domain.isCollapsed = !domain.isCollapsed;
  }

  onDomainSelect(domainId: number, domain: Domain) {

    this.domains.find(x => x.id == domain.id).id = domainId;
    console.log(this.domains);

    this.assignmentsDomainSkills = {
      domainId: domainId,
      pageNumber: this.sharedService.pagination.pageNumber,
      pageSize: this.sharedService.pagination.pageSize,
      searchValue: this.searchValue,
      selectedGrades: this.assignmentData.selectedGrades,
      selectedGroups: this.assignmentData.selectedGroups,
      selectedSections: this.assignmentData.selectedSections,
      selectedStudents: this.assignmentData.selectedStudents,
      subjectId: this.headerService.selectedSubjectId,
      sortColumn: this.sharedService.pagination.sortColumn,
      sortColumnDirection: this.sharedService.pagination.sortColumnDirection,
      totalPages: this.sharedService.pagination.totalPages,
      totalRecords: this.sharedService.pagination.totalRecords
    }

    this.addingAssignmentService.getAssignmentDomainsSkills(this.assignmentsDomainSkills).subscribe(res => {
      if (res.success) {
        this.skills = res.result;
        this.domains.find(x => x.id == domain.id).skills = this.skills.learningOutcomes;
        this.updateValues();
      }
    })
  }

  updateValues = () => {
    this.domains[this.domains.length - 1].totalQuestions = this.calculateTotalSummation();
    localStorage.setItem('AssignmentDomainsAndSkills', JSON.stringify(this.domains))
  }

  calculateTotalSummation = (): number => {
    let totalSummation = 0;
    // Iterate through the skillsDomains array and sum the values
    this.domains[this.domains.length - 1].skills.forEach(skill => {
      if (skill.beginnerValue) {
        totalSummation += skill.beginnerValue;
      }
      if (skill.intermediateValue) {
        totalSummation += skill.intermediateValue;
      }
      if (skill.advanceValue) {
        totalSummation += skill.advanceValue;
      }
    });

    console.log('Total Summation:', totalSummation);

    return totalSummation;
    
  }

    getDomainsTotal() {
    this.domains.forEach(domain =>{
      this.totalQuestions+=domain.totalQuestions;
    })
  }

  nextPage($event: PaginatorState) {
    this.sharedService.savePageState('studentsSubmissions', $event.page);
    this.first = $event.first;
    this.assignmentsDomainSkills.pageNumber = $event.page;
    this.getPaginatedSkills();
  }

  getPaginatedSkills() {
    this.addingAssignmentService.getAssignmentDomainsSkills(this.assignmentsDomainSkills).subscribe(res => {
      if (res.success) {
        this.skills = res.result;
        this.updateValues();
      }
    })
  }

  openQuestionPreview(skillName: string, difficultyLevel: string) {
    console.log('Opening question preview for:', skillName, difficultyLevel);
    this.selectedSkillName = skillName;
    this.selectedDifficultyLevel = difficultyLevel;
    this.showQuestionPreview = true;
    console.log('Popup visibility set to:', this.showQuestionPreview);
  }

  onQuestionsSelected(questions: any[]) {
    console.log('Selected questions:', questions);
    // Handle the selected questions - update the skill counts, etc.
  }
}
