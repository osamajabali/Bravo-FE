import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { Domain } from '../assignment-domains-and-skills/assignment-domains-and-skills.component';
import { AssignmentSetup } from '../../../../core/models/assignment/assignment-setup.model';

interface Skill {
  name: string;
  beginner: number;
  medium: number;
  advanced: number;
}

@Component({
  selector: 'app-skills-review',
  imports: [
    CommonModule,
    PanelModule,
  ],
  templateUrl: './skills-review.component.html',
  styleUrl: './skills-review.component.scss',
})
export class SkillsReviewComponent implements OnInit {

  domains: Domain[] = [];
  domainTotals : number = 0;
  domainNames = {
    'math': 'Mathematics',
    'science': 'Science',
    'language': 'Language Arts',
    'cs': 'Computer Science'
  };
  totalBeginnerValue: number = 0;
  totalIntermediateValue: number = 0;
  totalAdvanceValue: number = 0;
  assignmentSetup: AssignmentSetup = new AssignmentSetup();

  ngOnInit(): void {
    const domains = localStorage.getItem('AssignmentDomainsAndSkills');
    const assignmentSetup = localStorage.getItem('assignmentSetup');
    this.domains = JSON.parse(domains);
    this.assignmentSetup = JSON.parse(assignmentSetup);
    this.getDomainsTotal()
  }
  getDomainsTotal() {
    this.domains.forEach(domain =>{
      this.domainTotals+=domain.totalQuestions;
    })
  }

  toggleCollapse(domain: Domain) {
    domain.isCollapsed = !domain.isCollapsed;
  }

  getTotalQuestions(domain: Domain): number {
    domain.skills.forEach(skill => {
      this.totalBeginnerValue = skill.beginnerValue + this.totalBeginnerValue;
      this.totalIntermediateValue += skill.intermediateValue;
      this.totalAdvanceValue += skill.advanceValue;
    });
    
    return this.totalBeginnerValue 
  }
}
