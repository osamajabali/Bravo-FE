import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PanelModule } from 'primeng/panel';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AssignmentReadingPayload, Story } from '../../../../core/models/assignment/assignment-stories.model';
import { AssignmentSetup } from '../../../../core/models/assignment/assignment-setup.model';
import { TranslateModule } from '@ngx-translate/core';

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
    ButtonModule,
    TranslateModule
  ],
  templateUrl: './assignment-book-review.component.html',
  styleUrl: './assignment-book-review.component.scss',
})
export class AssignmentBookReviewComponent implements OnInit{
  @Output() stepChange = new EventEmitter<number>();
  
  selectedBook : Story = new Story();
  assignmentSetup : AssignmentSetup = new AssignmentSetup();
  assignmentTypeName: string;
  
  ngOnInit(): void {
    this.getAssignmentBook()
  }

  getAssignmentBook() {
    this.assignmentSetup = JSON.parse(localStorage.getItem('assignmentSetup'));
    let assignmentBookReading : AssignmentReadingPayload = JSON.parse(localStorage.getItem('assignmentBookReading'));
    this.selectedBook = assignmentBookReading.book;
    this.assignmentTypeName = assignmentBookReading.assignmentTypeName;
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
