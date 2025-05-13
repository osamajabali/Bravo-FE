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
import { AssignmentsService } from '../../../core/services/assignment/assignments.service';
import { AssignmentFilter } from '../../../core/models/assignment/assignment.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Subscription } from 'rxjs';

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
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';
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

  assignmentTypes : {assignmentTypeId : number , name : string}[] = [];

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
  assignmentFilter: AssignmentFilter = new AssignmentFilter();
  private refreshSubscription!: Subscription;

  constructor(private assignmentService: AssignmentsService, private headerService: HeaderService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe(() => {
      this.getAssignmentsFilter();
    });
  }

  getAssignmentsFilter() {
    this.assignmentService.getAssignmentFilters().subscribe(res => {
      if (res.success) {
        this.assignmentFilter = res.result;
      }
    });

    this.assignmentService.getAssignmentTypes(this.headerService.selectedSubjectId).subscribe(res => {
      if (res.success) {
        this.assignmentTypes = res.result;
      }
    })
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

  onSort(column: string): void {
    // Implement sorting logic for each column
    this.sortColumn = column;
    this.sortDirection =
      this.sortDirection === ''
        ? 'asc'
        : this.sortDirection === 'asc'
          ? 'desc'
          : '';
  }

  exportAssignment() {
    // Implement export functionality
    console.log('Export assignment:', this.selectedAssignment?.id);
    this.actionMenu.hide();
  }
}
