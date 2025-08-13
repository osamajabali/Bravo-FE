import { Component, OnInit, inject, signal } from '@angular/core';
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
    PasswordModule
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
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
  // Edit Group state
  isEditGroupMode: boolean = false;
  editingGroupId: number | null = null;
  // Selection states
  allStudentsSelected: boolean = false;
  allGroupsSelected: boolean = false;
  
  // Edit Profile Dialog state
  showEditProfileDialog: boolean = false;
  editingStudent: Student | null = null;
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
    console.log('Send Certificate clicked');
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
}
