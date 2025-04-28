import { Component, OnInit, OnDestroy } from '@angular/core';
import { Lessons, LessonsPagination, LessonsPayload } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { LearningOutcomesService } from '../../../core/services/teacher-dashboard-services/learning-outcomes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LessonCardsComponent } from '../../../shared/components/lesson-cards/lesson-cards.component';
import { SkillSummaryComponent, SkillSummaryData } from '../../../shared/components/skill-summary/skill-summary.component';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { PaginatorState } from 'primeng/paginator';
import { Subscription } from 'rxjs';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { SkeletonComponent } from "../../../shared/components/skeleton/skeleton.component";
import { Section } from '../../../core/models/header-models/header.model';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { SkillCurriculum } from '../../../core/models/teacher-dashboard-models/skill-curriculum.model';
import { Statistics, StatisticsResponse } from '../../../core/models/teacher-dashboard-models/statistics.model';
import { StatisticsEnum } from '../../../core/models/shared-models/enums';
import { SkillsStatisticsService } from '../../../core/services/skills/skills-statistics.service';

@Component({
  selector: 'app-lessons',
  imports: [LessonCardsComponent, TranslateModule, SkillSummaryComponent, PaginationComponent, SkeletonComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
})
export class LessonsComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  lessons: LessonsPagination = new LessonsPagination();
  lessonPayload: LessonsPayload = new LessonsPayload();
  first: number = 0;
  skillToActivate: Lessons | null = null;
  sections: Section[] = [];
  statistics: StatisticsResponse[] = [];


  constructor(
    private learningOutcomesService: LearningOutcomesService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private headerService: HeaderService,
    private statisticsService : SkillsStatisticsService
  ) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          
          this.lessonPayload.unitId = this.sharedService.getId('unitId');
          this.sections = this.headerService.sectionsArray;
          this.getLessons();
          this.getStatistics();
        });
      }
    });
  }

    getStatistics(){
      let model : Statistics ={
        courseSectionId: this.headerService.selectedSectionId,
        type: StatisticsEnum.Unit,
        id: this.lessonPayload.unitId
      }
      this.statisticsService.getStatistics(model).subscribe(res=>{
        if(res.success){
          this.statistics = res.result
        }
      })
    }
  

  onSearchChange($event: string) {
    this.lessonPayload.searchValue = $event;
    this.getLessons()
    }

  ngOnDestroy(): void { // Unsubscribe in ngOnDestroy
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }

  getLessons() {
    if(this.sharedService.getPageState('LessonsComponent')){
      let  pageNumber = this.sharedService.getPageState('LessonsComponent');
      this.lessonPayload.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.lessonPayload.pageSize;
    }
    this.lessonPayload.pageSize = this.sharedService.pagination.pageSize;
    this.lessonPayload.courseSectionId = this.headerService.selectedSectionId;
    this.learningOutcomesService
      .getUnitsLessons(this.lessonPayload)
      .subscribe((res) => {
        if (res.success) {
          this.lessons = res.result;
        }
      });
  }

  clickedCard(card: Lessons|LessonsCurriculums|SkillCurriculum) {
    this.sharedService.pushTitle((card as Lessons).name); 
    this.sharedService.saveId('lessonId' , (card as Lessons).lessonId );
    sessionStorage.removeItem('LessonsCurriculumsComponent');
    this.router.navigate(['/features/semesters/lessons-curriculums']);
    } 
    
    // Implement OnDestroy

  nextPage($event: PaginatorState) {
    this.lessonPayload.pageNumber = $event.page;
    this.sharedService.savePageState('LessonsComponent' , $event.page)
    this.first = $event.first;
    this.getLessons();
  }
}
