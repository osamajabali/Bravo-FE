import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TranslateModule } from '@ngx-translate/core';

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

@Component({
  selector: 'app-group-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CheckboxModule, TranslateModule, DatePickerModule, ButtonModule, DialogModule],
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss'
})
export class GroupDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);

  groupId!: number;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' | '' = '';
  allStudentsSelected = false;
  startDate: Date | null = null;
  endDate: Date | null = null;
  showDeleteDialog: boolean = false;

  students: Student[] = [
    { id: 1, name: 'Ahmed Mohamed Ali', initials: 'AM', practicedQuestions: 120, readStories: '10 books', progressedSkills: 12, leveledReading: 'Level 3A', lastLogin: '2 days ago', selected: false },
    { id: 2, name: 'Sara Hassan', initials: 'SH', practicedQuestions: 85, readStories: '7 books', progressedSkills: 9, leveledReading: 'Level 2B', lastLogin: '1 day ago', selected: false },
    { id: 3, name: 'Omar Youssef', initials: 'OY', practicedQuestions: 150, readStories: '12 books', progressedSkills: 15, leveledReading: 'Level 3B', lastLogin: '3 hours ago', selected: false },
  ];

  ngOnInit(): void {
    this.groupId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onSort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : this.sortDirection === 'desc' ? '' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  toggleAllStudents(checked: boolean): void {
    this.allStudentsSelected = checked;
    this.students.forEach(s => (s.selected = checked));
  }

  onStudentSelectionChange(): void {
    this.allStudentsSelected = this.students.length > 0 && this.students.every(s => s.selected);
  }

  // Header actions
  onFilter(): void {
    console.log('Filter clicked');
  }

  onSendCertificate(): void {
    console.log('Send Certificate clicked');
  }

  onCreateReport(): void {
    console.log('Create Report clicked');
  }

  onCreateGroup(): void {
    console.log('Create Group clicked');
  }

  onEditGroup(): void {
    console.log('Edit Group clicked');
  }

  hasSelectedRows(): boolean {
    return this.students.some(s => s.selected);
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
}
