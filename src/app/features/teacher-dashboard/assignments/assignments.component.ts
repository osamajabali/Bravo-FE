import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { Router } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

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

interface Assignment {
  id: number;
  title: string;
  status: 'active' | 'inactive' | 'scheduled';
  postDate: Date;
  dueDate: Date;
  submissions: string;
  assignedBy: string;
  target: string;
  avgScore: string;
}

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [
    PopoverModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    PaginationComponent,
    SelectButtonModule,
    SelectModule,
    DatePickerModule,
    FormsModule,
    MenuModule
  ],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent implements OnInit {
  @ViewChild('actionMenu') actionMenu!: Menu;
  
  sharedService = inject(SharedService);
  router = inject(Router);
  selectedTab: string = 'active';
  searchTerm = '';
  selectedSubject = null;
  selectedGrade = null;
  selectedHomeroom = null;
  startDate = null;
  endDate = null;
  creationDate = null;
  selectedAssignmentType = null;
  selectedAssignmentStatus = null;
  selectedSortOption = null;
  selectedOrderOption = null;
  selectedRecipient = null;
  showAdvancedSearch = false;
  subjects = [
    { label: 'English', value: 'english' },
    { label: 'Math', value: 'math' },
    { label: 'Science', value: 'science' },
    { label: 'Social Studies', value: 'social studies' },
  ];

  grades = [
    { label: 'Grade 1', value: 'grade1' },
    { label: 'Grade 2', value: 'grade2' },
    { label: 'Grade 3', value: 'grade3' },
    { label: 'Grade 4', value: 'grade4' },
    { label: 'Grade 5', value: 'grade5' },
  ];

  homerooms = [
    { label: 'Homeroom 1', value: 'homeroom1' },
    { label: 'Homeroom 2', value: 'homeroom2' },
    { label: 'Homeroom 3', value: 'homeroom3' },
  ];

  assignmentTypes = [
    { label: 'Assignment Type 1', value: 'assignmentType1' },
    { label: 'Assignment Type 2', value: 'assignmentType2' },
    { label: 'Assignment Type 3', value: 'assignmentType3' },
  ];

  assignmentStatuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];  

  orderOptions = [
    { label: 'Ascending', value: 'ascending' },
    { label: 'Descending', value: 'descending' },
  ];

  recipients = [
    { label: 'Recipient 1', value: 'recipient1' },
    { label: 'Recipient 2', value: 'recipient2' },
    { label: 'Recipient 3', value: 'recipient3' },
  ];
  
  sortOptions = [
    { label: 'Sort Option 1', value: 'sortOption1' },
    { label: 'Sort Option 2', value: 'sortOption2' },
    { label: 'Sort Option 3', value: 'sortOption3' },
  ];
  
  // Mock data for assignments
  assignments: Assignment[] = [
    {
      id: 1,
      title: 'Reading Comprehension',
      status: 'scheduled',
      postDate: new Date('2024-03-01'),
      dueDate: new Date('2024-03-15'),
      submissions: '12 out of 15',
      assignedBy: 'Teacher name',
      target: 'G4A, G4B',
      avgScore: '85%'
    },
    {
      id: 2,
      title: 'Vocabulary Practice',
      status: 'active',
      postDate: new Date('2024-03-05'),
      dueDate: new Date('2024-03-20'),
      submissions: '12 out of 15',
      assignedBy: 'System',
      target: 'G4A, G4B',
      avgScore: '85%'
    },
    {
      id: 3,
      title: 'Math Practice',
      status: 'inactive',
      postDate: new Date('2024-03-10'),
      dueDate: new Date('2024-03-25'),
      submissions: '12 out of 15',
      assignedBy: 'System',
      target: 'G4A, G4B',
      avgScore: '85%'
    }
  ];

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

  selectedAssignment: Assignment | null = null;

  ngOnInit(): void {
    this.sharedService.pushTitle('ASSIGNMENTS');
  }

  onTabClick(tab: string) {
    this.selectedTab = tab;
  }

  newAssignment() {
    this.router.navigate(['/features/assignments/new']);
  }

  viewAssignment(id: number) {
    this.router.navigate(['/features/assignments', id]);
  }

  onAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  onResetAdvancedSearch() {
    this.selectedSubject = null;
    this.selectedGrade = null;
    this.selectedHomeroom = null;
    this.startDate = null;
    this.endDate = null;
    this.creationDate = null;
    this.selectedAssignmentType = null;
    this.selectedAssignmentStatus = null;
    this.selectedSortOption = null;
    this.selectedOrderOption = null;
    this.selectedRecipient = null;
  }

  _onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
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

  showActionMenu(event: Event, assignment: Assignment) {
    this.selectedAssignment = assignment;
    if (this.actionMenu) {
      this.actionMenu.toggle(event);
    }
  }

  resendAssignment() {
    // Implement resend functionality
    console.log('Resend assignment:', this.selectedAssignment?.id);
    this.actionMenu.hide();
  }

  deactivateAssignment() {
    // Implement deactivate functionality
    console.log('Deactivate assignment:', this.selectedAssignment?.id);
    this.actionMenu.hide();
  }

  editAssignment() {
    // Implement edit functionality
    this.actionMenu.hide();
  }

  viewQuestions() {
    // Implement view questions functionality
    this.actionMenu.hide();
  }

  exportAssignment() {
    // Implement export functionality
    console.log('Export assignment:', this.selectedAssignment?.id);
    this.actionMenu.hide();
  }
}
