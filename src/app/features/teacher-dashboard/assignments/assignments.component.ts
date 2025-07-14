import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
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
import { Assignment, AssignmentFilter, AssignmentResponse, AssignmentsPayload } from '../../../core/models/assignment/assignment.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { forkJoin, Subscription } from 'rxjs';
import { Grade, Section, SectionFilter, Subject, SubjectGrade } from '../../../core/models/assignment/sections-filter.model';
import { MultiSelectModule } from 'primeng/multiselect';
import { DatePipe } from '@angular/common';
import { PaginatorState } from 'primeng/paginator';
import { TranslateModule } from '@ngx-translate/core';

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
    MultiSelectModule,
    TranslateModule
  ],
  providers: [DatePipe],
  templateUrl: './assignments.component.html',
  styleUrl: './assignments.component.scss'
})
export class AssignmentsComponent implements OnInit, OnDestroy {
  @ViewChild('actionMenu') actionMenu!: Menu;

  router = inject(Router);
  datePipe = inject(DatePipe);
  selectedTab: string = 'live';
  searchTerm = '';
  showAdvancedSearch: boolean = false;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';

  assignmentTypes: { assignmentTypeId: number, name: string }[] = [];

  // Mock data for assignments

  filterSections: FilterSection[] = [];

  selectedAssignment: Assignment | null = null;
  assignmentFilter: AssignmentFilter = new AssignmentFilter();
  private refreshSubscription!: Subscription;
  sectionFilter: SectionFilter = new SectionFilter();
  subjectGrade: SubjectGrade = new SubjectGrade();
  assignmentPayload: AssignmentsPayload = new AssignmentsPayload();
  startDate: Date = null;
  endDate: Date = null;
  creationDate: Date = null;
  assignments: AssignmentResponse = new AssignmentResponse();
  first: number = 0;

  constructor(
    private assignmentService: AssignmentsService,
    private headerService: HeaderService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('selectedItems')) {
      this.getAssignmentsFilter();
    }
    let check = this.sharedService.getSelectedItems()?.selectedGradeId == 0;
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if (((res == 'trigger') && check) || res == 'refresh') {
        this.getAssignmentsFilter();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getAssignmentsFilter() {
    forkJoin([
      this.assignmentService.getAssignmentFilters(),
      this.assignmentService.getAssignmentTypes(this.sharedService.getSelectedItems().selectedSubjectId),
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
          this.assignmentPayload.subjectId = this.sectionFilter.subjects.find(x => x.isSelected === true)?.subjectId;
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
        this.assignments = res.result;
      }
    });
  }

  nextPage($event: PaginatorState) {
    this.assignmentPayload.pageNumber = $event.page;
    this.sharedService.savePageState('studentsSubmissions', $event.page);
    this.first = $event.first;
    this.getAssignments();
  }

  onTabClick(tab: string) {
    this.selectedTab = tab;
  }

  newAssignment() {
    this.router.navigate(['/features/assignments/new']);
  }

  viewAssignment(id: number, type: number) {
    localStorage.setItem('assignmentSubmissionType', type.toString());
    localStorage.setItem('assignmentId', id.toString());
    sessionStorage.removeItem('studentsSubmissions')
    this.router.navigate(['/features/assignmentsDetails']);
  }

  onAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
    if (this.showAdvancedSearch) {
      this.getAssignmentsFilter();
    }
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
    this.actionMenu.hide();
  }

  deactivateAssignment() {
    this.actionMenu.hide();
  }

  editAssignment() {
    this.actionMenu.hide();
  }

  viewQuestions() {
    this.actionMenu.hide();
  }

  onSort(column: string): void {
    this.sortColumn = column;
    this.sortDirection =
      this.sortDirection === ''
        ? 'asc'
        : this.sortDirection === 'asc'
          ? 'desc'
          : '';
  }

  exportAssignment() {
    this.actionMenu.hide();
  }
}
