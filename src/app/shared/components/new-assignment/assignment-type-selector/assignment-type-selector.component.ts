import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AssignmentType {
  name: string;
  icon: string;
  title: string;
}

@Component({
  selector: 'app-assignment-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './assignment-type-selector.component.html',
  styleUrl: './assignment-type-selector.component.scss'
})
export class AssignmentTypeSelectorComponent {
  @Input() selectedAssignmentType: AssignmentType | null = null;
  @Output() selectedAssignmentTypeChange = new EventEmitter<AssignmentType>();

  assignmentTypes: AssignmentType[] = [
    {
      name: 'skills',
      icon: 'icon-skills-large',
      title: 'Skills',
    },
    {
      name: 'reading-comprehension',
      icon: 'icon-reading-comprehension',
      title: 'Reading Comprehension',
    },
    {
      name: 'oral-reading',
      icon: 'icon-oral-reading',
      title: 'Oral Reading',
    },
    {
      name: 'listening-comprehension',
      icon: 'icon-listening-comprehension',
      title: 'Listening Comprehension',
    },
    {
      name: 'writing',
      icon: 'icon-writing',
      title: 'Writing',
    },
    {
      name: 'speaking',
      icon: 'icon-speaking',
      title: 'Speaking',
    },
  ];

  selectAssignmentType(assignmentType: AssignmentType) {
    this.selectedAssignmentType = assignmentType;
    this.selectedAssignmentTypeChange.emit(assignmentType);
  }
} 