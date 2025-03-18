import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

interface Student {
  id: number;
  name: string;
  level: string;
  selected?: boolean;
}

@Component({
  selector: 'app-student-level',
  standalone: true,
  imports: [CommonModule, CheckboxModule, FormsModule],
  templateUrl: './student-level.component.html',
  styleUrl: './student-level.component.scss'
})
export class StudentLevelComponent {
  selectedHighAchievers: number[] = [];
  selectedLowAchievers: number[] = [];

  highAchievers: Student[] = [
    { id: 1, name: 'Ahmed Mohammed', level: 'Level 1', selected: false },
    { id: 2, name: 'Sara Ali', level: 'Level 2', selected: false },
    { id: 3, name: 'Omar Hassan', level: 'Level 3', selected: false },
    { id: 4, name: 'Fatima Ibrahim', level: 'Level 4', selected: false },
    { id: 5, name: 'Youssef Ahmad', level: 'Level 5', selected: false }
  ];

  lowAchievers: Student[] = [
    { id: 1, name: 'Layla Mahmoud', level: 'Level 1', selected: false },
    { id: 2, name: 'Karim Samir', level: 'Level 2', selected: false },
    { id: 3, name: 'Nour Hasan', level: 'Level 3', selected: false },
    { id: 4, name: 'Zainab Ali', level: 'Level 4', selected: false },
    { id: 5, name: 'Mohammed Khaled', level: 'Level 5', selected: false }
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }

  onStudentSelect(student: Student, isHighAchiever: boolean): void {
    const selectedArray = isHighAchiever ? this.selectedHighAchievers : this.selectedLowAchievers;
    
    if (student.selected) {
      selectedArray.push(student.id);
    } else {
      const index = selectedArray.indexOf(student.id);
      if (index > -1) {
        selectedArray.splice(index, 1);
      }
    }
  }

  get selectedStudentsCount(): number {
    return this.selectedHighAchievers.length + this.selectedLowAchievers.length;
  }
} 