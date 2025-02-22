import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Unit } from '../../../core/models/teacher-dashboard-models/units.model';

@Component({
  selector: 'app-units',
  imports: [CommonModule],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent {
  units: Unit[] = [
    { title: 'الوحدة الأولى', description: 'محتوى يذهب هنا' },
    { title: 'الوحدة الثانية', description: 'محتوى يذهب هنا' },
    { title: 'الوحدة الثالثة', description: 'محتوى يذهب هنا' },
    { title: 'الفصل الثاني - الوحدة الأولى', description: 'آخر فصل للوحدة' },
  ];
}
