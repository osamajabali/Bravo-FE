import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { StudentSubmission, SubmissionQuestion } from '../../models/assignment/student-submission.model';

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
}