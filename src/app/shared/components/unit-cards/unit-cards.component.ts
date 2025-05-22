import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Unit } from '../../../core/models/teacher-dashboard-models/units.model';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { Router } from '@angular/router';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { SkeletonComponent } from "../skeleton/skeleton.component";
import { PaginationComponent } from "../pagination/pagination.component";
import { PaginatorState } from 'primeng/paginator';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-unit-cards',
  imports: [CommonModule, TranslateModule],
  templateUrl: './unit-cards.component.html',
  styleUrl: './unit-cards.component.scss'
})
export class UnitCardsComponent {
  
  @Input() card: Unit = new Unit();
  @Output() cardClick = new EventEmitter<(Unit)>();
  
  constructor(private router: Router, private sharedService : SharedService) {}
  
  isUnit(card: Unit ): card is Unit {
    return 'unitLabelName' in card; // Type guard to check if card is a Unit
  }


  clickedCard(card: Unit ) {
    this.cardClick.emit(card)
  }
}
