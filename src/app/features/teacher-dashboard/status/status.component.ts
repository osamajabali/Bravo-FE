import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-status',
  standalone: true, // Mark the component as standalone
  imports: [CommonModule], // Import CommonModule here
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  stats = {
    activeSkills: 14,
    totalSkills: 564,
    masteredSkills: 2,
    skills: [
      { name: 'Reading', inductive: 432, activated: 8 },
      { name: 'Grammar', inductive: 432, activated: 8 },
      { name: 'Spelling', inductive: 432, activated: 8 },
      { name: 'Writing', inductive: 432, activated: 8 }
    ]
  };
}