import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Lessons } from '../../../core/models/teacher-dashboard-models/lessons.model';
import { Router } from '@angular/router';
import { LessonsCurriculums } from '../../../core/models/teacher-dashboard-models/lesson-curriculums.model';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { SkillActivationModalComponent } from '../skill-activation-modal/skill-activation-modal.component';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { PaginationComponent } from "../pagination/pagination.component";
import { PaginatorState } from 'primeng/paginator';
import { SkillCurriculum } from '../../../core/models/teacher-dashboard-models/skill-curriculum.model';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Section } from '../../../core/models/header-models/header.model';
import { SkillActivationService } from '../../../core/services/skills-activation/skill-activation.service';
import { SkillActivation } from '../../../core/models/teacher-dashboard-models/skillsActivation.model';
import { Result } from '../../../core/models/shared-models/result';

@Component({
  selector: 'app-lesson-cards',
  imports: [SkillActivationModalComponent],
  templateUrl: './lesson-cards.component.html',
  styleUrl: './lesson-cards.component.scss',
})
export class LessonCardsComponent implements OnInit {
  @Input() card: Lessons | LessonsCurriculums | SkillCurriculum= {} as Lessons | LessonsCurriculums  | SkillCurriculum;
  @Input() first: number = 0;
  @Input() showPagination: boolean;
  @Input() rows: number = 0;
  @Input() totalRecords: number = 0;
  @Input() sections: Section[] = [];
  @Output() paginatorState = new EventEmitter<PaginatorState>();
  @Output() skillActivation = new EventEmitter<boolean>();
  activateSkill: boolean = false;
  skillToActivate: Lessons | LessonsCurriculums | SkillCurriculum | null = null;
  skillActivationModel : SkillActivation = new SkillActivation();
  private refreshSubscription!: Subscription;

  constructor(private router: Router, private sharedService: SharedService , private skillActivationService : SkillActivationService) {

  }
  ngOnInit(): void {

  }

  onPageChange($event: PaginatorState) {
    this.paginatorState.emit($event)
  }


  isLesson(card: Lessons | LessonsCurriculums | SkillCurriculum): card is Lessons {
    return 'lessonId' in card;
  }

  isSkillCurriculum(card: Lessons | LessonsCurriculums | SkillCurriculum): card is SkillCurriculum {
    return 'domainName' in card;
  }

  getViewButtonText(card: Lessons | LessonsCurriculums | SkillCurriculum): string {
    if ((card as Lessons).lessonId) return 'View Curriculum';
    return 'View BB Skill';
  }

  toggleActive(card: Lessons | LessonsCurriculums | SkillCurriculum) {
    this.skillToActivate = card;
    this.activateSkill = true;
  }

  _activateSkill(selectedIds : number[]) {debugger
    this.activateSkill = false;
    if((this.skillToActivate as Lessons).lessonId ){
      this.skillActivationModel.lessonId = (this.skillToActivate as Lessons).lessonId;
      this.skillActivationModel.courseSectionIdList = selectedIds;
      this.skillActivationModel.activationStatus = this.skillToActivate.isEnabled;
      this.skillActivationService.activateLesson(this.skillActivationModel).subscribe(res =>{
        if(res.success){
          this.skillActivation.emit(res.success)
        }
      })
    }else if( (this.skillToActivate as LessonsCurriculums).curriculumLearningOutcomeId){debugger
      this.skillActivationModel.curriculumLearningOutcomeId = (this.skillToActivate as LessonsCurriculums).curriculumLearningOutcomeId;
      this.skillActivationModel.courseSectionIdList = selectedIds;
      this.skillActivationModel.activationStatus = this.skillToActivate.isEnabled;
      this.skillActivationService.activateCurriculum(this.skillActivationModel).subscribe(res =>{
        if(res.success){
          this.activateSkill = false;
          this.skillActivation.emit(res.success);
        }
      })
    }else{
      this.skillActivationModel.learningOutcomeId = (this.skillToActivate as SkillCurriculum).id;
      this.skillActivationModel.courseSectionIdList = selectedIds;
      this.skillActivationModel.activationStatus = this.skillToActivate.isEnabled;
      this.skillActivationService.activateSkill(this.skillActivationModel).subscribe(res =>{
        if(res.success){
          this.skillActivation.emit(res.success)
        }
      })
    }
    this.skillToActivate.isEnabled = !this.skillToActivate.isEnabled;
  }

  clickedCard(card: Lessons | LessonsCurriculums | SkillCurriculum) {
    if ((card as Lessons).lessonId) {
      this.sharedService.pushTitle((card as Lessons).name)
      this.router.navigate(['/features/lessons-curriculums', (card as Lessons).lessonId]);
    } else if ((card as LessonsCurriculums).curriculumLearningOutcomeId) {
      this.sharedService.pushTitle((card as LessonsCurriculums).name)
      const curriculumId = (card as LessonsCurriculums).curriculumLearningOutcomeId;
      this.router.navigate(['/features/single-skill', 0, curriculumId]);
    } else {
      const domainId = (card as LessonsCurriculums).id;
      this.sharedService.pushTitle((card as LessonsCurriculums).name)
      this.router.navigate([this.sharedService.nextRoute, domainId]);
    }
  }

}
