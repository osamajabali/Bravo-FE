import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Student {
  id: number;
  name: string;
  booksCount: number;
}

@Component({
  selector: 'app-student-level',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-level.component.html',
  styleUrl: './student-level.component.scss'
})
export class StudentLevelComponent {

  ngOnInit() {
  }

  highAchievers: Student[] = [
    { id: 1, name: 'Ahmed Mohammed', booksCount: 15 },
    { id: 2, name: 'Sara Ali', booksCount: 12 },
    { id: 3, name: 'Omar Hassan', booksCount: 14 },
    { id: 4, name: 'Fatima Ibrahim', booksCount: 13 },
    { id: 5, name: 'Youssef Ahmad', booksCount: 11 }
  ];

  lowAchievers: Student[] = [
    { id: 1, name: 'Layla Mahmoud', booksCount: 3 },
    { id: 2, name: 'Karim Samir', booksCount: 4 },
    { id: 3, name: 'Nour Hasan', booksCount: 2 },
    { id: 4, name: 'Zainab Ali', booksCount: 5 },
    { id: 5, name: 'Mohammed Khaled', booksCount: 3 }
  ];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
} 