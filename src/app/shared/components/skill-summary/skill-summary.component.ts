import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatisticsResponse } from '../../../core/models/teacher-dashboard-models/statistics.model';

interface FilterSection {
  title: string;
  expanded: boolean;
  options: FilterOption[];
  selectedOptions: string[];
}

interface FilterOption {
  label: string;
  value: string;
}

export interface SkillSummaryData {
  allSkills: number;
  activeSkills: number;
  questionSolved: number;
  timeSpent: number;
}

@Component({
  selector: 'app-skill-summary',
  standalone: true,
  imports: [PopoverModule, CommonModule, FormsModule],
  templateUrl: './skill-summary.component.html',
  styleUrls: ['./skill-summary.component.scss'],
})
export class SkillSummaryComponent {
  @Input() showAssignmentButton: boolean = false;
  @Input() data: StatisticsResponse[] =[];
  @Output() onSearchChange = new EventEmitter<string>();
  searchTerm: string = '';

  filterSections: FilterSection[] = [
    {
      title: 'Level',
      expanded: true,
      options: [
        { label: 'Beginner', value: 'Beginner' },
        { label: 'Average', value: 'Average' },
        { label: 'Advanced', value: 'Advanced' },
      ],
      selectedOptions: [],
    },
    {
      title: 'Status',
      expanded: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      selectedOptions: [],
    },
  ];

  _onSearchChange() {
    this.onSearchChange.emit(this.searchTerm); // Emit the correct value
  }

  toggleFilterSection(section: FilterSection): void {
    section.expanded = !section.expanded;
  }

  toggleCheckbox(section: FilterSection, value: string): void {
    const index = section.selectedOptions.indexOf(value);

    if (index !== -1) {
      section.selectedOptions.splice(index, 1);
    } else {
      section.selectedOptions.push(value);
    }
  }
}
