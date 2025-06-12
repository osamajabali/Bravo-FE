import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

interface Skill {
  name: string;
  beginner: number;
  medium: number;
  advanced: number;
}

interface Domain {
  id: number;
  selectedDomain: string;
  skills: Skill[];
  isCollapsed: boolean;
}

@Component({
  selector: 'app-assignment-book-review',
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    ButtonModule
  ],
  templateUrl: './assignment-book-review.component.html',
  styleUrl: './assignment-book-review.component.scss',
})
export class AssignmentBookReviewComponent {
  @Output() stepChange = new EventEmitter<number>();

  selectedBook = {
    id: 4,
    title: 'Ocean Discovery',
    coverUrl: 'assets/images/book-image.svg',
    levelName: 'Level 2',
    authorName: 'Sarah Wilson',
    studentLevel: 'Beginner',
  }

  moveToStep(step: number) {
    this.stepChange.emit(step);
  }

  toggleCollapse(domain: Domain) {
    domain.isCollapsed = !domain.isCollapsed;
  }

  getTotalQuestions(domain: Domain): number {
    return domain.skills.reduce((total, skill) => {
      return total + skill.beginner + skill.medium + skill.advanced;
    }, 0);
  }
}
