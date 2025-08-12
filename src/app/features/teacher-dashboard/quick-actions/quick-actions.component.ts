import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

interface Summary {
  icon: string;
  desc: string;
  value: number | string;
}

interface Tab {
  title: string;
  id: string;
}

@Component({
  selector: 'app-quick-actions',
  imports: [CommonModule, TranslateModule, ButtonModule],
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

  onTabClick(tab: string) {
    this.selectedTab = tab;
  }
}
