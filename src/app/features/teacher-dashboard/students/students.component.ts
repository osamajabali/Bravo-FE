import { Component, OnInit, inject } from '@angular/core';
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

interface Student {
  id: number;
  name: string;
  initials: string;
  practicedQuestions: number;
  readStories: string;
  progressedSkills: number;
  leveledReading: string;
  lastLogin: string;
  selected?: boolean;
}

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
    InputTextModule
  ],
  templateUrl: './students.component.html',
  styleUrl: './students.component.scss'
})
export class StudentsComponent implements OnInit {
  private router = inject(Router);
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
  // Selection states
  allStudentsSelected: boolean = false;
  allGroupsSelected: boolean = false;
  
  // Mock data for students
  students: Student[] = [
    {
      id: 1,
      name: 'Ahmed Mohamed Ali',
      initials: 'AM',
      practicedQuestions: 245,
      readStories: '12 books',
      progressedSkills: 18,
      leveledReading: 'Level 3A',
      lastLogin: '2 days ago',
      selected: false
    },
    {
      id: 2,
      name: 'Sara Hassan Ibrahim',
      initials: 'SH',
      practicedQuestions: 189,
      readStories: '8 books',
      progressedSkills: 15,
      leveledReading: 'Level 2B',
      lastLogin: '1 day ago',
      selected: false
    },
    {
      id: 3,
      name: 'Omar Abdullah Youssef',
      initials: 'OA',
      practicedQuestions: 312,
      readStories: '15 books',
      progressedSkills: 22,
      leveledReading: 'Level 4A',
      lastLogin: '3 hours ago',
      selected: false
    },
    {
      id: 4,
      name: 'Fatima Ali Mohamed',
      initials: 'FA',
      practicedQuestions: 156,
      readStories: '6 books',
      progressedSkills: 12,
      leveledReading: 'Level 2A',
      lastLogin: '5 days ago',
      selected: false
    },
    {
      id: 5,
      name: 'Khaled Mahmoud Hassan',
      initials: 'KM',
      practicedQuestions: 278,
      readStories: '11 books',
      progressedSkills: 19,
      leveledReading: 'Level 3B',
      lastLogin: '1 day ago',
      selected: false
    },
    {
      id: 6,
      name: 'Nour Ibrahim Ahmed',
      initials: 'NI',
      practicedQuestions: 201,
      readStories: '9 books',
      progressedSkills: 16,
      leveledReading: 'Level 3A',
      lastLogin: '4 hours ago',
      selected: false
    }
  ];

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
    // Component initialization
  }

  onTabClick(tab: string): void {
    this.selectedTab = tab;
    // Reset selections when switching tabs
    this.allStudentsSelected = false;
    this.allGroupsSelected = false;
    this.students.forEach(student => student.selected = false);
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
    this.students.forEach(student => (student.selected = checked));
  }

  onStudentSelectionChange(): void {
    this.allStudentsSelected = this.students.length > 0 && this.students.every(s => s.selected);
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
    this.selectedStudentsForGroup = this.students.filter(s => s.selected);
    this.showCreateGroupDrawer = true;
  }

  onFilter(): void {
    console.log('Filter clicked');
  }

  hasSelectedRows(): boolean {
    return this.students.some(student => student.selected) || this.groups.some(group => group.selected);
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
  }

  onConfirmCreateGroup(): void {
    // Placeholder: implement creation logic
    console.log('Create group', {
      title: this.newGroupTitle,
      students: this.selectedStudentsForGroup.map(s => s.id)
    });
    this.onCancelCreateGroup();
  }

  onRemoveStudentFromNewGroup(studentId: number): void {
    this.selectedStudentsForGroup = this.selectedStudentsForGroup.filter(s => s.id !== studentId);
  }

  onAddStudentToNewGroup(): void {
    // Initialize selection with currently chosen students
    this.addStudentsSelectedIds = new Set(this.selectedStudentsForGroup.map(s => s.id));
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
    this.selectedStudentsForGroup = this.students.filter(s => this.addStudentsSelectedIds.has(s.id));
    this.showAddStudentsDrawer = false;
  }
}
