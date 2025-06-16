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
  updatedSkills: SkillsDomain[];
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
    QuestionPreviewPopupComponent
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
    totalQuestions: 0,
    updatedSkills: []
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
  updatedSkills: SkillsDomain[] = [];

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
        if (localStorage.getItem('AssignmentDomainsAndSkills')) {
          let retrievedData: Domain[] = JSON.parse(localStorage.getItem('AssignmentDomainsAndSkills'));
          this.domains = retrievedData;
        } else {
          this.domains[0].skillDomains = this.skillDomains;
        }
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
      totalQuestions: 0,
      updatedSkills: []
    });

    this.getDomainsTotal();
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
      selectedGrades: this.assignmentData.selectedGrades,
      selectedGroups: this.assignmentData.selectedGroups,
      selectedSections: this.assignmentData.selectedSections,
      selectedStudents: this.assignmentData.selectedStudents,
      subjectId: this.headerService.selectedSubjectId,
    }

    this.addingAssignmentService.getAssignmentDomainsSkills(this.assignmentsDomainSkills).subscribe(res => {
      if (res.success) {
        this.skills = res.result;
        this.domains.find(x => x.id == domain.id).skills = this.skills.learningOutcomes;
      }
    })
  }

  updateValues = (skill: SkillsDomain, skillLevel: string, domain: Domain) => {
    if (!domain) return;

    this.domains.find(x => x.id == domain.id).totalQuestions = this.calculateTotalSummation();

    // Create a temporary object to store skill data
    const updatedSkill = { ...skill };

    // Dynamically set the value for beginner, intermediate, or advanced based on the skill level.
    updatedSkill[`${skillLevel}Value`] = skill[`${skillLevel}Value`];

    // Check if the skill already exists in the updatedSkills array.
    const skillExists = this.updatedSkills.some(
      (existingSkill) => existingSkill.name === updatedSkill.name
    );

    // If the skill doesn't exist, add it to the array.
    if (!skillExists) {
      this.updatedSkills.push(updatedSkill);
    } else {
      // If the skill exists, update the corresponding skill in the array.
      const index = this.updatedSkills.findIndex((existingSkill) => existingSkill.name === updatedSkill.name);
      this.updatedSkills[index] = updatedSkill;
    }

    console.log('Updated Skills:', this.updatedSkills);
    this.domains.find(x => x.id == domain.id).updatedSkills = this.updatedSkills;
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
    this.domains.forEach(domain => {
      this.totalQuestions += domain.totalQuestions;
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
