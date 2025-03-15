import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { Level } from '../../../core/models/teacher-dashboard-models/students.model';

export interface UserSection {
  title: string;
  count: number;
  status: string;
  users: User[];
}

interface User {
  id: number;
  name: string;
  avatar?: string;
  status: number;
}

interface Student {
  studentName: string;
  isMastered: boolean;
  isSelected?: boolean;
}

interface Section {
  levelId: number;
  levelName: string;
  studentsOfLevel: Student[];
}

@Component({
  selector: 'app-user-drawer',
  standalone: true,
  imports: [CommonModule, SidebarModule, ButtonModule, CheckboxModule, FormsModule],
  templateUrl: './user-drawer.component.html',
  styleUrl: './user-drawer.component.scss',
})
export class UserDrawerComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() sections: Level[] = [];

  closeDrawer(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
