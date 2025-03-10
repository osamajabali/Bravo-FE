import { Component, OnInit } from '@angular/core';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { UnitCardsComponent } from "../../../shared/components/unit-cards/unit-cards.component";
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lessons',
  imports: [UnitCardsComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss'
})
export class LessonsComponent implements OnInit {
  lessons: Lessons[] = [];
  unitId: number | null = null;


  constructor(private learningOutcomesService : LearningOutcomesService , private route: ActivatedRoute){}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.unitId = parseInt(params.get('id'));
      this.getLessons();
    });
  }

  getLessons() {
    this.learningOutcomesService.getUnitsLessons(this.unitId).subscribe(res => {
      if(res.success){
        this.lessons = res.result;
      }
    })
  }
}
