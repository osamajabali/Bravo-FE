import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { PanelModule } from 'primeng/panel';

interface Skill {
  name: string;
  beginner: number;
  medium: number;
  advanced: number;
}

interface Domain {
  id: number;
  selectedDomain?: string;
  searchText: string;
  skills: Skill[];
  isCollapsed: boolean;
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
  ],
  templateUrl: './assignment-domains-and-skills.component.html',
  styleUrl: './assignment-domains-and-skills.component.scss',
})
export class AssignmentDomainsAndSkillsComponent {
  selectedOption: string = '';
  domains: Domain[] = [{
    id: 1,
    searchText: '',
    skills: [],
    isCollapsed: false
  }];
  
  skillDomains = [
    { label: 'Mathematics', value: 'math' },
    { label: 'Science', value: 'science' },
    { label: 'Language Arts', value: 'language' },
    { label: 'Computer Science', value: 'cs' }
  ];

  addDomain() {
    this.domains.push({
      id: this.domains.length + 1,
      searchText: '',
      skills: [],
      isCollapsed: false
    });
  }

  removeDomain(id: number) {
    this.domains = this.domains.filter(domain => domain.id !== id);
  }

  toggleCollapse(domain: Domain) {
    domain.isCollapsed = !domain.isCollapsed;
  }

  onDomainSelect(domain: Domain) {
    // Dummy skills data - in real app, this would come from an API
    if (domain.selectedDomain) {
      domain.skills = [
        { name: 'Algebra', beginner: 0, medium: 0, advanced: 0 },
        { name: 'Geometry', beginner: 0, medium: 0, advanced: 0 },
        { name: 'Calculus', beginner: 0, medium: 0, advanced: 0 }
      ];
    }
  }
}
