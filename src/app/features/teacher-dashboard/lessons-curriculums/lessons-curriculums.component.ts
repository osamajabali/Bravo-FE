import { Component, OnInit } from '@angular/core';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute } from '@angular/router';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { SearchComponent } from "../../../shared/components/search/search.component";
import { UnitCardsComponent } from "../../../shared/components/unit-cards/unit-cards.component";

@Component({
  selector: 'app-lessons-curriculums',
  imports: [UnitCardsComponent],
  templateUrl: './lessons-curriculums.component.html',
  styleUrl: './lessons-curriculums.component.scss'
})
export class LessonsCurriculumsComponent implements OnInit {
  curriculums: LessonsCurriculums[] = [];
  lessonId: number;

  constructor(private learningOutcomesService: LearningOutcomesService , private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.lessonId = parseInt(params.get('id'));
      this.getCurriculums()
    });
    
  }
  getCurriculums() {
    this.learningOutcomesService.lessonsCurriculums(this.lessonId).subscribe(res => {
      if (res) {
        this.curriculums = res.result
      }
    })
  }

}
