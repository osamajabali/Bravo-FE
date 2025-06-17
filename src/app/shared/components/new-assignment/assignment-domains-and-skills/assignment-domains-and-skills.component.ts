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
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';

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
  learningOutcomes: SkillsDomain[];
  skillDomains: { domainId: number; name: string; }[],
  isCollapsed: boolean;
  totalQuestions: number;
  updatedSkills: SkillsDomain[];
  first: number;
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
    TranslateModule,
    PaginatorModule
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
    id: 0,
    searchText: '',
    skills: [],
    isCollapsed: false,
    skillDomains: [],
    totalQuestions: 0,
    updatedSkills: [],
    learningOutcomes: [],
    first: 0
  }];


  // Popup state
  showQuestionPreview: boolean = false;
  selectedSkillName: string = '';
  selectedDifficultyLevel: string = '';
  assignmentDomain: AssignmentsDomain = new AssignmentsDomain();
  skillDomains: { domainId: number; name: string; }[] = [];
  selectedSkillId: number;
  assignmentData: AssignmentSetup = new AssignmentSetup();
  searchValue: string = '';
  assignmentsDomainSkills: AssignmentsDomainSkills = new AssignmentsDomainSkills();
  totalQuestions: number = 0;
  updatedSkills: SkillsDomain[] = [];
  rows: number = 5;
  protected Math = Math;

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
          this.getDomainsTotal()
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
      id: 0,
      searchText: '',
      skills: [],
      isCollapsed: false,
      skillDomains: newSkillDomains,
      totalQuestions: 0,
      updatedSkills: [],
      first: 0,
      learningOutcomes: []
    });

  }


  removeDomain(id: number) {
    this.domains = this.domains.filter(domain => domain.id !== id);
    localStorage.setItem('AssignmentDomainsAndSkills', JSON.stringify(this.domains));
    if (!this.domains.length) {
      this.domains = [{
        id: 0,
        searchText: '',
        skills: [],
        isCollapsed: false,
        skillDomains: this.skillDomains,
        totalQuestions: 0,
        updatedSkills: [],
        learningOutcomes: [],
        first: 0
      }];
    }
  }

  filterData = (domain : Domain) =>{
    domain.skills = domain.learningOutcomes.filter(skill => skill.name.toLowerCase().includes(this.searchValue.toLowerCase()))
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
        let currentDomain = this.domains.find(x => x.id == domainId);
        currentDomain.skills = res.result.learningOutcomes;
        currentDomain.learningOutcomes = res.result.learningOutcomes;
      }
    })
  }

  updateValues = (skill: SkillsDomain, skillLevel: string, domain: Domain) => {
    if (!domain) return;

    // Create a temporary object to store updated skill data
    const updatedSkill = { ...skill };

    // Dynamically update the value for beginner, intermediate, or advanced based on the skillLevel
    updatedSkill[`${skillLevel}Value`] = skill[`${skillLevel}Value`];

    // Find the domain where the skills need to be updated
    const domainSkills = this.domains.find(x => x.id === domain.id);

    if (!domainSkills) {
      console.log("Domain not found");
      return;
    }

    // Check if the skill already exists in the updatedSkills array for this domain
    const skillExists = domainSkills.updatedSkills.some(
      (existingSkill) => existingSkill.name === updatedSkill.name
    );

    // If the skill doesn't exist in the domain's updatedSkills array, add it
    if (!skillExists) {
      domainSkills.updatedSkills.push(updatedSkill);
    } else {
      // If the skill exists, update the corresponding skill in the domain's updatedSkills array
      const index = domainSkills.updatedSkills.findIndex(
        (existingSkill) => existingSkill.name === updatedSkill.name
      );
      domainSkills.updatedSkills[index] = updatedSkill;
    }

    console.log('Updated Skills for Domain:', domainSkills.updatedSkills);

    // Recalculate the total number of questions for this domain
    domainSkills.totalQuestions = this.calculateTotalSummation(domain);

    // Save the updated domains with skills to localStorage
    localStorage.setItem('AssignmentDomainsAndSkills', JSON.stringify(this.domains));
    this.getDomainsTotal();
  };

  calculateTotalSummation = (domain: Domain): number => {
    let totalSummation = 0;
    // Iterate through the skillsDomains array and sum the values
    domain.updatedSkills.forEach(skill => {
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
    this.totalQuestions = 0;
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

  // onPageChange(event: PaginatorState, domain: Domain) {
  //   domain.first = event.first;
  //   this.loadSkillsPage(event.first / event.rows);
  // }

  // // Function to load skills for the current page
  // loadSkillsPage(pageIndex: number) {
  //   const startIndex = pageIndex * this.rows;
  //   const endIndex = startIndex + this.rows;
  //   this.domains.forEach(x => x.skills = x.learningOutcomes.slice(startIndex, endIndex));
  // }
}
