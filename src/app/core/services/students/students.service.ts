import { inject, Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Result } from '../../models/shared-models/result';
import { Observable } from 'rxjs';
import { Student } from '../../models/students/students.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {
 httpService = inject(HttpService);

  getStudents(courseSectionId: number) : Observable<Result<Student[]>> {
    return this.httpService.post(`learners/students/details`, { courseSectionId : courseSectionId });
  }

  getGroups(courseSectionId: number) : Observable<Result<Student[]>> {
    return this.httpService.post(`learners/groups`, { courseSectionId : courseSectionId });
  }
}
