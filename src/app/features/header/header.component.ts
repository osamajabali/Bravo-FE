import { CommonModule, DOCUMENT, isPlatformBrowser, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { Popover, PopoverModule } from 'primeng/popover';
import { ButtonModule, ButtonDirective } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { HeaderService } from '../../core/services/header-services/header.service';
import { SharedService } from '../../core/services/shared-services/shared.service';
import { LoginService } from '../../core/services/login-services/login.service';
import { Classes, ClassesData, Section } from '../../core/models/header-models/header.model';
import { ClassesEnum } from '../../core/models/shared-models/enums';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SpinnerService } from '../../core/services/shared-services/spinner.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    PopoverModule,
    ButtonDirective,
    RadioButtonModule,
    MenuModule,
    TranslateModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('filterContent') filterContent: Popover;  // Get the reference to the popover
  // Services via Inject
  private readonly loginService = inject(LoginService);
  private readonly headerService = inject(HeaderService);
  private readonly sharedService = inject(SharedService);
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  // Properties
  selectedGradeId: number | null = null;
  selectedSubjectId: number | null = null;
  selectedSectionId: number | null = null;
  classesEnum = ClassesEnum;
  userMenuItems: MenuItem[] = [];
  selectedFiltersText: string = 'Choose properties';
  overlayVisible = false;
  userInitials = 'LS';
  userRole = 'Teacher';
  userName = 'Laila Aslama';
  position = 'Teacher';
  classesData: ClassesData = new ClassesData();
  displayFilter = 'Select filters'; // Initializes the display filter
  private refreshSubscription!: Subscription;

  // Subscriptions
  private subscriptions = new Subscription();
  sectionExpanded: boolean = true;
  GradesExpanded: boolean;
  SubjectExpanded: boolean;
  title: string = 'title';
  checkTitle: boolean = true;
  currentLang: string;

  constructor(private spinnerService: SpinnerService) { }

  ngOnInit(): void {
    
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.checkTitleAvailability();
        this.title = this.sharedService.getTitle()
      })
    );
    
    this.setupUserMenu();
    this.getUserName()
    this.checkTitleAvailability();
    this.title = this.sharedService.getTitle()
    this.getClasses();
    this.sectionExpanded = true;
    this.GradesExpanded = false;
    this.SubjectExpanded = false;
  }

  checkTitleAvailability() {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('title')) {
        let titleArray = JSON.parse(localStorage.getItem('title'))
        this.checkTitle = (titleArray.length == 1);
      } else {
        this.checkTitle = true;
      }
    }
  }

  getUserName() {
    this.userName = localStorage.getItem('userName');
    this.userInitials = this.getInitials(this.userName)
  }

  getInitials(name: string): string {
    const words = name?.trim()?.split(/\s+/); // Split by spaces
    if (words?.length < 2) return ''; // Ensure at least two words exist

    const firstInitial = words ? words[0]?.charAt(0)?.toUpperCase() : '';
    const secondInitial = words ? words[1]?.charAt(0)?.toUpperCase() : '';

    return firstInitial + secondInitial;
  }


  private setupUserMenu(): void {
    this.translate.get(['PROFILE', 'LOGOUT', 'CHANGE_LANGUAGE']).subscribe(translations => {
      this.userMenuItems = [
        { label: translations['PROFILE'], icon: 'pi pi-user', command: () => { } },
        { separator: true },
        { label: translations['CHANGE_LANGUAGE'], icon: 'pi pi-language', command: () => this.switchLanguage() },
        { separator: true },
        { label: translations['LOGOUT'], icon: 'pi pi-sign-out', command: () => this.logout() }
      ];
    });
  }

  switchLanguage(): void {
    this.currentLang = localStorage.getItem('language') === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('language', this.currentLang);
    this.setDirection(this.currentLang)
  }

  setDirection(lang: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('language', lang)
      this.document.documentElement.lang = lang;
      this.document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  getClasses(): void {
    const model: Classes = {
      gradeId: this.headerService.selectedGradeId ?? 0,
      roleId: parseInt(localStorage.getItem('roleId') || '0'),
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId ?? 0,
      courseSectionId: this.headerService.selectedSectionId ?? 0
    };

    this.subscriptions.add(
      this.headerService.getClasses(model).subscribe(res => {
        if (!res.success) return;

        this.classesData = res.result;
        this.selectedGradeId = this.findSelectedId(this.classesData.grades, 'gradeId');
        this.headerService.selectedGradeId = this.selectedGradeId;

        this.selectedSubjectId = this.findSelectedId(this.classesData.subjects, 'subjectId');
        this.sharedService.getSelectedItems().selectedSubjectId = this.selectedSubjectId;

        this.selectedSectionId = this.findSelectedId(this.classesData.courseSections, 'courseSectionId');
        this.headerService.selectedSectionId = this.selectedSectionId;

        this.headerService.sectionsArray = this.classesData.courseSections;

        this.displayFilter = `${this.getSelectedName(this.classesData.grades)}, ${this.getSelectedName(this.classesData.courseSections)} , ${this.getSelectedName(this.classesData.subjects)} `;

        let selectedItems = {
          selectedGradeId: this.selectedGradeId,
          selectedSubjectId: this.selectedSubjectId,
          selectedSectionId: this.selectedSectionId,
        }
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems))
        this.sharedService.triggerRefresh('trigger');
      })
    );
  }

  refreshClasses = () => {
    // const model: Classes = {
    //   gradeId: 0,
    //   roleId: parseInt(localStorage.getItem('roleId') || '0'),
    //   subjectId: 0,
    //   courseSectionId: 0
    // };

    // this.subscriptions.add(
    //   this.headerService.getClasses(model).subscribe(res => {
    //     if (!res.success) return;
    //     this.classesData = res.result;
    //     this.selectedGradeId = this.findSelectedId(this.classesData.grades, 'gradeId');
    //     this.headerService.selectedGradeId = this.selectedGradeId;

    //     this.selectedSubjectId = this.findSelectedId(this.classesData.subjects, 'subjectId');
    //     this.sharedService.getSelectedItems().selectedSubjectId = this.selectedSubjectId;

    //     this.selectedSectionId = this.findSelectedId(this.classesData.courseSections, 'courseSectionId');
    //     this.headerService.selectedSectionId = this.selectedSectionId;

    //     this.headerService.sectionsArray = this.classesData.courseSections;

    //     this.displayFilter = `${this.getSelectedName(this.classesData.grades)}, ${this.getSelectedName(this.classesData.courseSections)} , ${this.getSelectedName(this.classesData.subjects)} `;

    //     this.GradesExpanded = false;
    //     this.SubjectExpanded = false;
    //     this.sectionExpanded = true;
    //     this.sharedService.triggerRefresh(res);
    //   })
    // );
  }

  private updateClasses(): void {

    const model: Classes = {
      gradeId: this.headerService.selectedGradeId ?? 0,
      roleId: parseInt(localStorage.getItem('roleId') || '0', 10),
      subjectId: this.sharedService.getSelectedItems().selectedSubjectId ?? 0,
      courseSectionId: this.headerService.selectedSectionId ?? 0
    };

    this.headerService.getClasses(model).subscribe(res => {
      if (res.success) {
        this.classesData = res.result;
      }
    });

  }

  selectedItem(id: number, classesEnum: ClassesEnum) {
    if (this.classesEnum.subject === classesEnum) {
      this.sharedService.getSelectedItems().selectedSubjectId = id;
      this.headerService.selectedGradeId = 0;
      this.selectedSubjectId = id;
      this.classesData.grades = [];
      this.updateClasses();
    } else if (this.classesEnum.grade === classesEnum) {
      this.headerService.selectedGradeId = id;
      this.selectedGradeId = id;
      this.classesData.courseSections = [];
      this.updateClasses();
    } else {
      console.log('section id', id);
      this.headerService.selectedSectionId = id;
      this.selectedSectionId = id;
      this.updateClasses()
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
    this.displayFilter = `${this.getSelectedName(this.classesData.grades)}, ${this.getSelectedName(this.classesData.courseSections)} , ${this.getSelectedName(this.classesData.subjects)} `;
    const url = this.router.url;
    this.filterContent.hide();  // Close the popover
    if (url.includes('semester')) {
      // Route to the component based on URL check
      this.router.navigate(['/features/semesters']);
    }
    if (url.includes('skills')) {
      // Route to the component based on URL check
      this.router.navigate(['/features/skills']);
    }
    $event.stopPropagation();
    let selectedItems = {
      selectedGradeId: this.selectedGradeId,
      selectedSubjectId: this.selectedSubjectId,
      selectedSectionId: this.selectedSectionId,
    }
    localStorage.setItem('selectedItems', JSON.stringify(selectedItems))
    this.sharedService.triggerRefresh('refresh');
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
    this.checkTitleAvailability();
    if (!this.checkTitle) {
      this.sharedService.popTitle();
      this.location.back();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
