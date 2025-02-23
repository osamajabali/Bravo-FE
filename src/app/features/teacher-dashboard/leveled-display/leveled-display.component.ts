import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/teacher-dashboard/header/header.component';

@Component({
  selector: 'app-leveled-display',
  imports: [CommonModule, HeaderComponent],
  templateUrl: './leveled-display.component.html',
  styleUrl: './leveled-display.component.scss',
})
export class LeveledDisplayComponent {
  values: string[] = ['ا', 'ب', 'ت', 'ث', 'ج'];
}
