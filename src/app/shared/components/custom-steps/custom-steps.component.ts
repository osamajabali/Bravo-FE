import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepItem } from '../../../features/teacher-dashboard/new-assignment/new-assignment.component';

@Component({
  selector: 'app-custom-steps',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-steps.component.html',
  styleUrl: './custom-steps.component.scss'
})
export class CustomStepsComponent {
  @Input() items: StepItem[] = [];
  @Input() activeIndex: number = 0;
}