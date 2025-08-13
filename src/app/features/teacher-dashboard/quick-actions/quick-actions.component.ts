import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

interface Summary {
  icon: string;
  desc: string;
  value: number | string;
}

interface Tab {
  title: string;
  id: string;
}

interface TimePeriodOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-quick-actions',
  imports: [CommonModule, TranslateModule, ButtonModule, DropdownModule, FormsModule],
  templateUrl: './quick-actions.component.html',
  styleUrl: './quick-actions.component.scss',
})
export class QuickActionsComponent {
  summary: Summary[] = [
    {
      icon: 'icon-dashboard-students.svg',
      desc: 'NO_OF_STUDENTS',
      value: 24,
    },
    {
      icon: 'icon-dashboard-questions.svg',
      desc: 'NO_OF_QS_SOLVED',
      value: 2345,
    },
    {
      icon: 'icon-dashboard-students.svg',
      desc: 'NO_OF_BOOKS_READ',
      value: 12,
    },
    {
      icon: 'icon-dashboard-skills.svg',
      desc: 'ACTIVATED_SKILLS',
      value: '12%',
    },
    {
      icon: 'icon-dashboard-questions.svg',
      desc: 'PROGRESSED_SKILLS',
      value: '24%',
    },
  ];

  tabs: Tab[] = [
    {
      title: 'LEARNING_OUTCOMES',
      id: '1',
    },
    {
      title: 'READING_COMPREHENSION',
      id: '2',
    },
    {
      title: 'ASSIGNMENTS',
      id: '3',
    },
    {
      title: 'EXAMS',
      id: '4',
    },
  ];

  selectedTab: string = this.tabs[0].id;

  timePeriodOptions: TimePeriodOption[] = [
    { label: 'LAST_7_DAYS', value: '7days' },
    { label: 'LAST_30_DAYS', value: '30days' },
    { label: 'LAST_3_MONTHS', value: '3months' },
    { label: 'LAST_6_MONTHS', value: '6months' },
    { label: 'LAST_YEAR', value: '1year' }
  ];

  selectedTimePeriod: TimePeriodOption = this.timePeriodOptions[1]; // Default to 30 days

  onTabClick(tab: string) {
    this.selectedTab = tab;
  }

  onTimePeriodChange(event: any) {
    this.selectedTimePeriod = event.value;
    // Handle time period change logic here
    console.log('Time period changed to:', this.selectedTimePeriod);
  }
}
