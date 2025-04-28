import { CommonModule, DOCUMENT, isPlatformBrowser, Location } from '@angular/common';
import { Component, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
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
  sectionExpanded: boolean;
  GradesExpanded: boolean;
  SubjectExpanded: boolean;
  title: string = 'title';
  checkTitle : boolean;
  currentLang: string;

  ngOnInit(): void {
    this.setupUserMenu();
    this.getClasses();
    this.getUserName()
    
    this.refreshSubscription = this.sharedService.refresh$.subscribe(() => {
      this.checkTitleAvailability();
      this.title = this.sharedService.getTitle()
    });

    // Listen to route changes and refresh classes
    this.subscriptions.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.getClasses()
      })
    );

  }

  checkTitleAvailability() {
    if (typeof window !== 'undefined') {
    if(localStorage.getItem('title')){
      let titleArray = JSON.parse(localStorage.getItem('title'))
      this.checkTitle =  (titleArray.length == 2);
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
      roleId: parseInt(localStorage.getItem('roleId') || '0', 10),
      subjectId: this.headerService.selectedSubjectId ?? 0
    };

    this.subscriptions.add(
      this.headerService.getClasses(model).subscribe(res => {
        if (!res.success) return;

        this.classesData = res.result;

        this.selectedGradeId = this.findSelectedId(this.classesData.grades, 'gradeId');
        this.headerService.selectedGradeId = this.selectedGradeId;

        this.selectedSubjectId = this.findSelectedId(this.classesData.subjects, 'subjectId');
        this.headerService.selectedSubjectId = this.selectedSubjectId;

        this.selectedSectionId = this.findSelectedId(this.classesData.courseSections, 'courseSectionId');
        this.headerService.selectedSectionId = this.selectedSectionId;

        this.headerService.sectionsArray = this.classesData.courseSections
        this.displayFilter = `${this.getSelectedName(this.classesData.grades)}, ${this.getSelectedName(this.classesData.courseSections)} , ${this.getSelectedName(this.classesData.subjects)} `;

        this.sharedService.triggerRefresh(res);
      })
    );
  }

  private updateClasses(): void {
    const model: Classes = {
      gradeId: this.headerService.selectedGradeId ?? 0,
      roleId: parseInt(localStorage.getItem('roleId') || '0', 10),
      subjectId: this.headerService.selectedSubjectId ?? 0
    };

    this.headerService.getClasses(model).subscribe(res => {
      if (!res.success) return;

      this.classesData = res.result;
      this.displayFilter = `${this.getSelectedName(this.classesData.grades)}, ${this.getSelectedName(this.classesData.courseSections)} , ${this.getSelectedName(this.classesData.subjects)} `;
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
      console.log('section id', id);
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
    setTimeout(() => {
      this.sharedService.popTitle();
      this.location.back();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
