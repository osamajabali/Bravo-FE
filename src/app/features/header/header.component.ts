import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { HeaderService } from '../../core/services/header-services/header.service';
import { SharedService } from '../../core/services/shared-services/shared.service';
import { LoginService } from '../../core/services/login-services/login.service';
import { PageTitleService } from '../../core/services/shared-services/page-title.service';
import { FilterService } from '../../core/services/shared-services/filter.service';
import { Classes, ClassesData } from '../../core/models/header-models/header.model';
import { ClassesEnum } from '../../core/models/shared-models/enums';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    OverlayPanelModule,
    ButtonModule,
    RadioButtonModule,
    MenuModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  // Services via Inject
  private readonly loginService = inject(LoginService);
  private readonly headerService = inject(HeaderService);
  private readonly sharedService = inject(SharedService);
  public readonly pageTitleService = inject(PageTitleService);
  private readonly filterService = inject(FilterService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  // Properties
  selectedGradeId: number | null = null;
  selectedSubjectId: number | null = null;
  selectedSectionId: number | null = null;
  classesEnum = ClassesEnum;
  userMenuItems: MenuItem[] = [];
  filterSections: FilterSection[] = [];
  selectedFiltersText: string = 'Choose properties';
  overlayVisible = false;
  pageTitle = '';
  userInitials = 'AS';
  userRole = 'Teacher';
  userName = 'Laila Aslama';
  position = 'Teacher';
  classesData: ClassesData = new ClassesData();
  displayFilter = 'Select filters'; // Initializes the display filter

  // Subscriptions
  private subscriptions = new Subscription();

  ngOnInit(): void {
    this.setupPageTitleSubscription();
    this.setupUserMenu();
    this.getClasses();

    // Listen to route changes and refresh classes
    this.subscriptions.add(
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.getClasses();
        }
      })
    );
  }

  private setupPageTitleSubscription(): void {
    this.subscriptions.add(
      this.pageTitleService.getPageTitle().subscribe(title => {
        this.pageTitle = title;
      })
    );
  }

  private setupUserMenu(): void {
    this.userMenuItems = [
      { label: 'Profile', icon: 'pi pi-user', command: () => this.openProfile() },
      { separator: true },
      { label: 'Logout', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];
  }

  private getClasses(): void {
    const model: Classes = {
      gradeId: this.headerService.selectedGradeId ?? 0,
      roleId: parseInt(localStorage.getItem('roleId') || '0', 10),
      subjectId: this.headerService.selectedSubjectId ?? 0
    };

    this.headerService.getClasses(model).subscribe(res => {
      if (!res.success) return;

      this.classesData = res.result;

      this.selectedGradeId = this.findSelectedId(this.classesData.grades, 'gradeId');
      this.headerService.selectedGradeId = this.selectedGradeId;

      this.selectedSubjectId = this.findSelectedId(this.classesData.subjects, 'subjectId');
      this.headerService.selectedSubjectId = this.selectedSubjectId;

      this.selectedSectionId = this.findSelectedId(this.classesData.courseSections, 'courseSectionId');
      this.headerService.selectedSectionId = this.selectedSectionId;

      this.displayFilter = `${this.getSelectedName(this.classesData.grades)}, ${this.getSelectedName(this.classesData.subjects)}`;

      this.sharedService.triggerRefresh(res);
      this.updateFilterSections();
      this.subscribeToFilterChanges();
    });
  }

  private findSelectedId(list: any[], key: string): number | null {
    const selected = list.find(item => item.isSelected);
    return selected ? selected[key] : null;
  }

  private getSelectedName(list: any[]): string {
    const selected = list.find(item => item.isSelected);
    return selected ? selected.name : '';
  }

  private updateFilterSections(): void {
    this.filterSections = [
      { name: 'Grade', expanded: false, options: this.classesData.grades, selectedOption: this.selectedGradeId?.toString() ?? null },
      { name: 'Section', expanded: false, options: this.classesData.courseSections, selectedOption: this.selectedSectionId?.toString() ?? null },
      { name: 'Subject', expanded: false, options: this.classesData.subjects, selectedOption: this.selectedSubjectId?.toString() ?? null }
    ];
  }

  private subscribeToFilterChanges(): void {
    this.subscriptions.add(
      this.filterService.getSelectedFiltersText().subscribe(text => {
        this.selectedFiltersText = text;
      })
    );
  }

  applyFilters(): void {
    this.filterService.applyFilters();
    this.overlayVisible = false;
  }

  clearAllFilters(): void {
    this.filterService.clearAllFilters();
    this.overlayVisible = false;
    this.displayFilter = 'Select filters';
  }

  logout(): void {
    this.loginService.logout();
  }

  goBack(): void {
    this.location.back();
  }

  private openProfile(): void {
    console.log('Profile clicked');
  }

  selectOption(section: FilterSection, value: string): void {
    this.filterSections = this.filterSections.map(s =>
      s.name === section.name ? { ...s, selectedOption: s.selectedOption === value ? null : value } : s
    );
    this.filterService.updateFilterSections(this.filterSections);
  }

  
  toggleFilterSection(section: FilterSection): void {
    this.filterService.toggleFilterSection(section);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}


export interface FilterSection {
  name: string;
  expanded: boolean;
  options: any[];
  selectedOption: string | null;
}

export interface FilterOption {
  label: string;
  value: string;
}
