import { CommonModule, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { HeaderService } from '../../core/services/header-services/header.service';
import { SharedService } from '../../core/services/shared-services/shared.service';
import { LoginService } from '../../core/services/login-services/login.service';
import { Classes, ClassesData, Section } from '../../core/models/header-models/header.model';
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
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);

  // Properties
  selectedGradeId: number | null = null;
  selectedSubjectId: number | null = null;
  selectedSectionId: number | null = null;
  classesEnum = ClassesEnum;
  userMenuItems: MenuItem[] = [];
  selectedFiltersText: string = 'Choose properties';
  overlayVisible = false;
  pageTitle = '';
  userInitials = 'LS';
  userRole = 'Teacher';
  userName = 'Laila Aslama';
  position = 'Teacher';
  classesData: ClassesData = new ClassesData();
  displayFilter = 'Select filters'; // Initializes the display filter

  // Subscriptions
  private subscriptions = new Subscription();
  sectionExpanded: boolean;
  GradesExpanded: boolean;
  SubjectExpanded: boolean;
  title: string;

  ngOnInit(): void {
    this.setupUserMenu();
    this.getClasses();

    // Debugging: Log all route configurations
    console.log('Current Route Config:', this.router.config);

    this.route.data.subscribe(data => {
      this.title = data['title'];

    });

    // Listen to route changes and refresh classes
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.updateTitle();
        this.getClasses()
      })
    );

    this.updateTitle()
  }

  updateTitle() {
    let activeRoute = this.route;
    
    while (activeRoute.firstChild) {
      activeRoute = activeRoute.firstChild;
    }

    // Extract title from the active route's data
    activeRoute.data.subscribe(data => {
      this.title = data['title'] || 'Default Title';
      this.title = this.title;
      console.log('Resolved Page Title:', this.title);
    });
  }


  private setupUserMenu(): void {
    this.userMenuItems = [
      { label: 'Profile', icon: 'pi pi-user', command: () => { } },
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
    });
  }

  private updateClasses(): void {
    const model: Classes = {
      gradeId: this.headerService.selectedGradeId ?? 0,
      roleId: parseInt(localStorage.getItem('roleId') || '0', 10),
      subjectId: this.headerService.selectedSubjectId ?? 0
    };
    debugger
    this.headerService.getClasses(model).subscribe(res => {
      if (!res.success) return;

      this.classesData = res.result;
      this.displayFilter = `${this.getSelectedName(this.classesData.grades)}, ${this.getSelectedName(this.classesData.subjects)}`;
      this.sharedService.triggerRefresh(res);
    });
  }

  selectedItem(id: number, classesEnum: ClassesEnum) {
    if (this.classesEnum.subject === classesEnum) {
      this.headerService.selectedSubjectId = id;
      this.headerService.selectedGradeId = 0;
      this.selectedSubjectId = id
      this.updateClasses();
    } else if (this.classesEnum.grade === classesEnum) {
      this.headerService.selectedGradeId = id;
      this.selectedGradeId = id;
      this.updateClasses();
    } else {
      this.headerService.selectedSectionId = id;
      this.selectedSectionId = id;
      this.updateClasses();
    }
  }



  private findSelectedId(list: any[], key: string): number | null {
    const selected = list.find(item => item.isSelected);
    return selected ? selected[key] : null;
  }

  private getSelectedName(list: any[]): string {
    const selected = list.find(item => item.isSelected);
    return selected ? selected.name : '';
  }


  // Method to apply the filter
  applyFilter($event) {
    $event.stopPropagation();
    this.sharedService.triggerRefresh('trigger');
  }

  // Method to clear all selections
  clearAll($event) {
    $event.stopPropagation();
    this.displayFilter = 'Select filters'; // Reset display filter
  }

  logout(): void {
    this.loginService.logout();
  }

  goBack(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
