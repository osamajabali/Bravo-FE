import { Injectable } from '@angular/core';
import { Classes, ClassesData, Section } from '../../models/header-models/header.model';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { HttpService } from '../shared-services/http.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  selectedSubjectId : number = 0;
  selectedGradeId : number = 0;
  selectedSectionId : number = 0;
  sectionsArray: Section[] = [];

  constructor(private apiHlpr : HttpService) { }

  
    getClasses = (obj: Classes): Observable<Result<ClassesData>> => {
      return this.apiHlpr.post<Result<ClassesData>>(`home/classes`, obj);
    }
}
