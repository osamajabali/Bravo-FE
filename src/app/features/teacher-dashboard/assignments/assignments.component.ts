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
import { AssignmentFilter, AssignmentsPayload } from '../../../core/models/assignment/assignment.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { forkJoin, Subscription } from 'rxjs';
import { Grade, Section, SectionFilter, Subject, SubjectGrade } from '../../../core/models/assignment/sections-filter.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePipe } from '@angular/common';

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
    MenuModule,
    MultiSelectModule
  ],
    providers: [DatePipe],  
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent implements OnInit {
  @ViewChild('actionMenu') actionMenu!: Menu;

  router = inject(Router);
  datePipe = inject(DatePipe);
  selectedTab: string = 'active';
  searchTerm = '';
  showAdvancedSearch = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  assignmentTypes: { assignmentTypeId: number, name: string }[] = [];

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
  sectionFilter: SectionFilter = new SectionFilter();
  subjectGrade: SubjectGrade = new SubjectGrade();
  assignmentPayload: AssignmentsPayload = new AssignmentsPayload();
  startDate: Date = null;
  endDate: Date = null;
  creationDate: Date = null;

  constructor(private assignmentService: AssignmentsService, private headerService: HeaderService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe(() => {
      this.getAssignmentsFilter();
    });
  }

  getAssignmentsFilter() {
    forkJoin([
      this.assignmentService.getAssignmentFilters(),
      this.assignmentService.getAssignmentTypes(this.headerService.selectedSubjectId),
      this.assignmentService.getAssignmentSectionFilters(this.subjectGrade)
    ]).subscribe(
      ([filterRes, typeRes, sectionRes]) => {
        if (filterRes.success) {
          this.assignmentFilter = filterRes.result;
        }

        if (typeRes.success) {
          this.assignmentTypes = typeRes.result;
        }

        if (sectionRes.success) {
          this.sectionFilter = sectionRes.result;
          this.assignmentPayload.gradeIds = [this.sectionFilter.grades.find(x => x.isSelected === true)?.gradeId];
          this.assignmentPayload.courseSectionIds = [this.sectionFilter.sections.find(x => x.isSelected === true)?.courseSectionId];
          this.assignmentPayload.subjectIds = [this.sectionFilter.subjects.find(x => x.isSelected === true)?.subjectId];
        }

        if (sectionRes.success && typeRes.success && filterRes.success) {
          this.getAssignments();
        }
      }
    );
  }
  getAssignments() {
    this.assignmentPayload.startDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
    this.assignmentPayload.endDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');
    this.assignmentPayload.creationDate = this.datePipe.transform(this.creationDate, 'yyyy-MM-dd');

    this.assignmentService.getAssignments(this.assignmentPayload).subscribe(res => {
      if (res.success) {

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
    this.assignmentPayload = new AssignmentsPayload();
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
