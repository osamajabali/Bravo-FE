import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { StudentSubmission, SubmissionQuestion } from '../../models/assignment/student-submission.model';
import { SubmissionReadingDetails } from '../../models/assignment-submission/reading-submission-details';
import { OralSubmissionDetails } from '../../models/assignment-submission/oral-submission-details';
import { StoryPage } from '../../models/assignment-submission/story-page';

@Injectable({
  providedIn: 'root'
})
export class SubmissionService {

  controller: string = 'assignment';

  constructor(private apiHlpr: HttpService) { }


  getStudentSubmission = (submissionId: number, studentId: number): Observable<Result<StudentSubmission>> => {
    return this.apiHlpr.post<Result<StudentSubmission>>(`${this.controller}/student-submission`, { assignmentId: submissionId, studentId: studentId });
  }

  getSkillQuestions = (submissionId: number, studentId: number, skillId: number): Observable<Result<SubmissionQuestion[]>> => {
    return this.apiHlpr.post<Result<SubmissionQuestion[]>>(`${this.controller}/skill-questions`, { assignmentId: submissionId, studentId: studentId, skillId: skillId });
  }

  getReadingSubmissionDetails = (submissionId: number, studentId: number): Observable<Result<SubmissionReadingDetails>> => {
    return this.apiHlpr.post<Result<SubmissionReadingDetails>>(`${this.controller}/reading-comprehension/student-submission-details`, { assignmentId: submissionId, studentId: studentId });
  }

  getOralReadingSubmissionDetails = (submissionId: number, studentId: number): Observable<Result<OralSubmissionDetails>> => {
    return this.apiHlpr.post<Result<OralSubmissionDetails>>(`${this.controller}/oral-reading/student-submission-details`, { assignmentId: submissionId, studentId: studentId });
  }

  getStoryPage = (storyPageId: number): Observable<Result<StoryPage>> => {
    return this.apiHlpr.post<Result<StoryPage>>(`${this.controller}/story-page`, { storyPageId: storyPageId });
  }
}