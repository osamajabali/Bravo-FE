import { Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';

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
  selector: 'app-leveled-book-summary',
  imports: [ButtonModule, OverlayPanelModule],
  templateUrl: './leveled-book-summary.component.html',
  styleUrl: './leveled-book-summary.component.scss',
})
export class LeveledBookSummaryComponent {
  data = input<SkillSummaryData>();
  onSearchChange = output<string>();
  searchTerm = '';

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

  _onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.onSearchChange.emit(this.searchTerm);
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
