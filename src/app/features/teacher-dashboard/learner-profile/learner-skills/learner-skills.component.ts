import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearnerCollapsibleSectionsComponent } from '../learner-collapsible-sections/learner-collapsible-sections.component';

@Component({
  selector: 'app-learner-skills',
  standalone: true,
  imports: [
    CommonModule,
    LearnerCollapsibleSectionsComponent
  ],
  templateUrl: './learner-skills.component.html',
  styleUrl: './learner-skills.component.scss'
})
export class LearnerSkillsComponent {

}
