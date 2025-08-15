import { Component, OnInit, AfterViewInit, inject, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { Router, RouterModule } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { PasswordModule } from 'primeng/password';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DropdownModule } from 'primeng/dropdown';
import { StudentsService } from '../../../core/services/students/students.service';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { Subscription } from 'rxjs';
import { Student } from '../../../core/models/students/students.model';

interface Group {
  id: number;
  groupName: string;
  numberOfStudents: number;
  selected?: boolean;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DatePickerModule,
    FormsModule,
    TranslateModule,
    CheckboxModule,
    RouterModule,
    DialogModule,
    DrawerModule,
    InputTextModule,
    TabViewModule,
    PasswordModule,
    RadioButtonModule,
    DropdownModule
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit, AfterViewInit {
  @ViewChild('templateImages') templateImagesRef!: ElementRef<HTMLDivElement>;
  
  private router = inject(Router);
  public sharedService = inject(SharedService);
  private studentsService = inject(StudentsService);
  private refreshSubscription!: Subscription;
  selectedTab: string = 'homeroom';
  startDate: Date | null = null;
  endDate: Date | null = null;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';
  showDeleteDialog: boolean = false;
  showCreateGroupDrawer: boolean = false;
  newGroupTitle: string = '';
  selectedStudentsForGroup: Student[] = [];
  // Add Students drawer state
  showAddStudentsDrawer: boolean = false;
  private addStudentsSelectedIds: Set<number> = new Set<number>();
  // Certificate students selection state
  private certificateStudentsSelectedIds: Set<number> = new Set<number>();
  // Edit Group state
  isEditGroupMode: boolean = false;
  editingGroupId: number | null = null;
  // Selection states
  allStudentsSelected: boolean = false;
  allGroupsSelected: boolean = false;
  
  // Edit Profile Dialog state
  showEditProfileDialog: boolean = false;
  editingStudent: Student | null = null;
  
  // Certificate Template Drawer state
  showCertificateDrawer: boolean = false;
  currentStep: number = 1;
  totalSteps: number = 3;
  selectedLanguage: string = 'arabic';
  selectedColor: string = 'multicolor';
  selectedTemplate: number = 1;
  scrollbarThumbWidth: number = 50;
  scrollbarThumbPosition: number = 0;
  
  // Sample template data
  certificateTemplates = [
    { id: 1, name: 'Template 1', image: '/assets/images/sample-certificate.png' },
    { id: 2, name: 'Template 2', image: '/assets/images/sample-certificate.png' },
    { id: 3, name: 'Template 3', image: '/assets/images/sample-certificate.png' },
    { id: 4, name: 'Template 4', image: '/assets/images/sample-certificate.png' },
    { id: 5, name: 'Template 5', image: '/assets/images/sample-certificate.png' },
    { id: 6, name: 'Template 2', image: '/assets/images/sample-certificate.png' },
    { id: 7, name: 'Template 3', image: '/assets/images/sample-certificate.png' },
    { id: 8, name: 'Template 4', image: '/assets/images/sample-certificate.png' },
    { id: 9, name: 'Template 5', image: '/assets/images/sample-certificate.png' },
    { id: 44, name: 'Template 6', image: '/assets/images/sample-certificate.png' }
  ];

  // Certificate form data
  certificateForm = {
    schoolName: '',
    certificationType: '',
    selectedDate: null as Date | null
  };

  // Certification types dropdown options
  certificationTypes = [
    { label: 'Reading Achievement', value: 'reading' },
    { label: 'Writing Excellence', value: 'writing' },
    { label: 'Speaking Proficiency', value: 'speaking' },
    { label: 'Listening Skills', value: 'listening' },
    { label: 'Overall Performance', value: 'overall' },
    { label: 'Participation Award', value: 'participation' }
  ];
  editProfileForm = {
    firstNameEn: '',
    lastNameEn: '',
    firstNameAr: '',
    lastNameAr: '',
    username: '',
    password: ''
  };
  
  // Parent form model
  parentForm = {
    firstNameEn: '',
    lastNameEn: '',
    firstNameAr: '',
    lastNameAr: '',
    username: '',
    password: '',
    email: ''
  };

  // Modify Reading Level form model
  modifyReadingLevelForm = {
    currentLevel: '',
    newLevel: ''
  };
  
  // Mock data for students
  students= signal<Student[]>([]);
  // Mock data for groups
  groups: Group[] = [
    {
      id: 1,
      groupName: 'Advanced Readers',
      numberOfStudents: 12,
      selected: false
    },
    {
      id: 2,
      groupName: 'Beginner Level',
      numberOfStudents: 18,
      selected: false
    },
    {
      id: 3,
      groupName: 'Math Champions',
      numberOfStudents: 15,
      selected: false
    },
    {
      id: 4,
      groupName: 'Science Explorers',
      numberOfStudents: 20,
      selected: false
    },
    {
      id: 5,
      groupName: 'Language Masters',
      numberOfStudents: 14,
      selected: false
    }
  ];

  ngOnInit(): void {
    if (localStorage.getItem('selectedItems')) {
      this.getStudents();
      this.getGroups();
    }
    let check = this.sharedService.getSelectedItems()?.selectedGradeId == 0;
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if (((res == 'trigger') && check) || res == 'refresh') {
        this.getGroups();
        this.getStudents();
      }
    });
  }

  ngAfterViewInit(): void {
    // Initialize scrollbar position after view is ready
    setTimeout(() => {
      this.initializeScrollbar();
    }, 0);
  }

  private initializeScrollbar(): void {
    if (this.templateImagesRef?.nativeElement && this.showCertificateDrawer) {
      const element = this.templateImagesRef.nativeElement;
      
      // Force a reflow to ensure dimensions are calculated
      element.offsetWidth;
      
      // Check if content is loaded (images have dimensions)
      const hasContent = element.scrollWidth > element.clientWidth;
      
      if (hasContent) {
        this.updateScrollbarPosition(element);
      } else {
        // Retry after a short delay if content isn't ready
        setTimeout(() => {
          if (this.templateImagesRef?.nativeElement && this.showCertificateDrawer) {
            this.updateScrollbarPosition(this.templateImagesRef.nativeElement);
          }
        }, 200);
      }
    }
  }

  getStudents() {
    this.studentsService.getStudents(this.sharedService.getSelectedItems()?.selectedSectionId).subscribe((res) => {
      if(res){
        this.students.set(res.result);
      }
    });
  }

  getGroups() {
    this.studentsService.getGroups(this.sharedService.getSelectedItems()?.selectedSectionId).subscribe((res) => {
      if(res){
        // this.groups.set(res.result);
      }
    });
  }

  onTabClick(tab: string): void {
    this.selectedTab = tab;
    // Reset selections when switching tabs
    this.allStudentsSelected = false;
    this.allGroupsSelected = false;
    this.groups.forEach(group => group.selected = false);
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? '' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    
    // Here you would implement actual sorting logic
    console.log(`Sorting by ${column} in ${this.sortDirection} direction`);
  }

  // Student selection methods
  toggleAllStudents(checked: boolean): void {
    this.allStudentsSelected = checked;
  }

  onStudentSelectionChange(): void {
    // this.allStudentsSelected = this.students.length > 0 && this.students.every(s => s.selected);
  }

  // Group selection methods
  toggleAllGroups(checked: boolean): void {
    this.allGroupsSelected = checked;
    this.groups.forEach(group => (group.selected = checked));
  }

  onGroupSelectionChange(): void {
    this.allGroupsSelected = this.groups.length > 0 && this.groups.every(g => g.selected);
  }

  // Button actions (placeholders)
  onSendCertificate(): void {
    this.showCertificateDrawer = true;
    this.currentStep = 1;
    
    // Initialize scrollbar after drawer is rendered
    setTimeout(() => {
      this.initializeScrollbar();
    }, 100);
  }

  onCreateReport(): void {
    console.log('Create Report clicked');
  }

  onCreateGroup(): void {
    this.isEditGroupMode = false;
    this.editingGroupId = null;
    this.newGroupTitle = '';
    this.showCreateGroupDrawer = true;
  }

  onFilter(): void {
    console.log('Filter clicked');
  }

  hasSelectedRows() {
    // return this.students.some(student => student.selected) || this.groups.some(group => group.selected);
  }

  goToGroupDetails(groupId: number): void {
    this.router.navigate(['/features/students/groups', groupId]);
  }

  onDeleteGroupClick(): void {
    this.showDeleteDialog = true;
  }

  onConfirmDelete(): void {
    this.showDeleteDialog = false;
    console.log('Group deleted');
  }

  onCancelDelete(): void {
    this.showDeleteDialog = false;
  }

  // Drawer actions
  onCancelCreateGroup(): void {
    this.showCreateGroupDrawer = false;
    this.newGroupTitle = '';
    this.selectedStudentsForGroup = [];
    this.isEditGroupMode = false;
    this.editingGroupId = null;
  }

  onConfirmCreateGroup(): void {
    this.onSubmitGroup();
  }

  onSubmitGroup(): void {
    if (this.isEditGroupMode) {
      console.log('Save group', {
        groupId: this.editingGroupId,
        title: this.newGroupTitle,
        // students: this.selectedStudentsForGroup.map(s => s.id)
      });
    } else {
      console.log('Create group', {
        title: this.newGroupTitle,
        // students: this.selectedStudentsForGroup.map(s => s.id)
      });
    }
    this.onCancelCreateGroup();
  }

  onRemoveStudentFromNewGroup(studentId: number): void {
    // this.selectedStudentsForGroup = this.selectedStudentsForGroup.filter(s => s.id !== studentId);
  }

  onAddStudentToNewGroup(): void {
    // Initialize selection with currently chosen students
    // this.addStudentsSelectedIds = new Set(this.selectedStudentsForGroup.map(s => s.id));
    this.showAddStudentsDrawer = true;
  }

  // Add Students drawer helpers
  isStudentSelectedForAdd(studentId: number): boolean {
    return this.addStudentsSelectedIds.has(studentId);
  }

  toggleStudentAddSelection(studentId: number, checked: boolean): void {
    if (checked) {
      this.addStudentsSelectedIds.add(studentId);
    } else {
      this.addStudentsSelectedIds.delete(studentId);
    }
  }

  onCancelAddStudents(): void {
    this.showAddStudentsDrawer = false;
  }

  onConfirmAddStudents(): void {
    // this.selectedStudentsForGroup = this.students.filter(s => this.addStudentsSelectedIds.has(s.id));
    this.showAddStudentsDrawer = false;
  }

  // Certificate students selection helpers
  isStudentSelectedForCertificate(studentIndex: number): boolean {
    return this.certificateStudentsSelectedIds.has(studentIndex);
  }

  toggleStudentCertificateSelection(studentIndex: number, checked: boolean): void {
    if (checked) {
      this.certificateStudentsSelectedIds.add(studentIndex);
    } else {
      this.certificateStudentsSelectedIds.delete(studentIndex);
    }
  }

  onEditGroup(group: Group): void {
    this.isEditGroupMode = true;
    this.editingGroupId = group.id;
    this.newGroupTitle = group.groupName;
    // In a real app, we'd load the group's students here
    this.showCreateGroupDrawer = true;
  }

  // Edit Profile methods
  onEditStudentProfile(student: Student): void {
    this.editingStudent = student;
    // Populate form with current student data
    this.editProfileForm = {
      firstNameEn: '',
      lastNameEn:  '',
      firstNameAr: '', // In real app, this would come from student data
      lastNameAr: '', // In real app, this would come from student data
      username: '', // In real app, this would come from student data
      password: '' // In real app, this would come from student data
    };
    
    // Initialize parent form (in real app, this would come from API)
    this.parentForm = {
      firstNameEn: '',
      lastNameEn: '',
      firstNameAr: '',
      lastNameAr: '',
      username: '',
      password: '',
      email: ''
    };

    this.modifyReadingLevelForm = {
      currentLevel: '',
      newLevel: ''
    };
    
    this.showEditProfileDialog = true;
  }

  onSaveEditProfile(): void {
    if (this.editingStudent) {
      console.log('Saving student profile:', {
        studentId: 0,
        studentForm: this.editProfileForm,
        parentForm: this.parentForm
      });
      // In real app, you would make an API call here
      this.onCancelEditProfile();
    }
  }

  onCancelEditProfile(): void {
    this.showEditProfileDialog = false;
    this.editingStudent = null;
    this.editProfileForm = {
      firstNameEn: '',
      lastNameEn: '',
      firstNameAr: '',
      lastNameAr: '',
      username: '',
      password: ''
    };
    this.parentForm = {
      firstNameEn: '',
      lastNameEn: '',
      firstNameAr: '',
      lastNameAr: '',
      username: '',
      password: '',
      email: ''
    };
    this.modifyReadingLevelForm = {
      currentLevel: '',
      newLevel: ''
    };
  }

  // Helper methods for template
  getInitials(studentName: string): string {
    if (!studentName) return '';
    return studentName.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
  }

  getPracticedQuestions(student: Student): string {
    // Mock data - replace with actual logic
    return '15';
  }

  getReadStories(student: Student): string {
    // Mock data - replace with actual logic
    return '8';
  }

  getProgressedSkills(student: Student): string {
    // Mock data - replace with actual logic
    return '12';
  }

  getLeveledReading(student: Student): string {
    // Mock data - replace with actual logic
    return 'Level 3';
  }

  getLastLogin(student: Student): string {
    // Mock data - replace with actual logic
    return '2 days ago';
  }

  // Certificate Template Drawer methods
  onCancelCertificate(): void {
    this.showCertificateDrawer = false;
    this.currentStep = 1;
    this.selectedLanguage = 'arabic';
    this.selectedColor = 'multicolor';
    this.selectedTemplate = 1;
    this.certificateStudentsSelectedIds.clear();
    this.certificateForm = {
      schoolName: '',
      certificationType: '',
      selectedDate: null
    };
  }

  onNextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  onPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
      
      // Reinitialize scrollbar if going back to step 1
      if (this.currentStep === 1) {
        setTimeout(() => {
          this.initializeScrollbar();
        }, 50);
      }
    }
  }

  isFirstStep(): boolean {
    return this.currentStep === 1;
  }

  isLastStep(): boolean {
    return this.currentStep === this.totalSteps;
  }

  onTemplateScroll(event: Event): void {
    const element = event.target as HTMLElement;
    this.updateScrollbarPosition(element);
  }

  private updateScrollbarPosition(element: HTMLElement): void {
    const scrollLeft = element.scrollLeft;
    const scrollWidth = element.scrollWidth;
    const clientWidth = element.clientWidth;
    
    // Calculate thumb width as percentage of visible area
    if (scrollWidth > 0 && clientWidth > 0) {
      this.scrollbarThumbWidth = Math.max((clientWidth / scrollWidth) * 100, 10);
      
      // Calculate thumb position as percentage
      const maxScrollLeft = scrollWidth - clientWidth;
      if (maxScrollLeft > 0) {
        this.scrollbarThumbPosition = (scrollLeft / maxScrollLeft) * (100 - this.scrollbarThumbWidth);
      } else {
        this.scrollbarThumbPosition = 0;
      }
    } else {
      // Default values when content isn't loaded yet
      this.scrollbarThumbWidth = 50;
      this.scrollbarThumbPosition = 0;
    }
  }

  onScrollbarClick(event: MouseEvent): void {
    if (!this.templateImagesRef?.nativeElement) return;
    
    const scrollbarElement = event.currentTarget as HTMLElement;
    if (!scrollbarElement) return;
    
    const rect = scrollbarElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const scrollbarWidth = rect.width;
    const clickPercentage = clickX / scrollbarWidth;
    
    const templateImages = this.templateImagesRef.nativeElement;
    const maxScrollLeft = templateImages.scrollWidth - templateImages.clientWidth;
    
    if (maxScrollLeft > 0) {
      templateImages.scrollLeft = clickPercentage * maxScrollLeft;
    }
  }

  onScrollbarMouseDown(event: MouseEvent): void {
    if (!this.templateImagesRef?.nativeElement) return;
    
    event.preventDefault();
    const startX = event.clientX;
    const startScrollLeft = this.templateImagesRef.nativeElement.scrollLeft || 0;
    const scrollbarElement = event.currentTarget as HTMLElement;
    
    if (!scrollbarElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!this.templateImagesRef?.nativeElement) return;
      
      const deltaX = e.clientX - startX;
      const templateImages = this.templateImagesRef.nativeElement;
      const scrollbarWidth = scrollbarElement.getBoundingClientRect().width;
      const maxScrollLeft = templateImages.scrollWidth - templateImages.clientWidth;
      
      if (maxScrollLeft > 0 && scrollbarWidth > 0) {
        const scrollRatio = deltaX / scrollbarWidth;
        const newScrollLeft = startScrollLeft + (scrollRatio * maxScrollLeft);
        
        templateImages.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}
