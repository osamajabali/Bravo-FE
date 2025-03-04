import { Injectable } from '@angular/core';
import { Classes, ClassesData } from '../../models/header-models/header.model';
import { Observable } from 'rxjs';
import { Result } from '../../models/shared-models/result';
import { HttpService } from '../shared-services/http.service';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  selectedSubjectId : number;
  selectedGradeId : number;
  selectedSectionId : number;

  constructor(private apiHlpr : HttpService) { }

  
    getClasses = (obj: Classes): Observable<Result<ClassesData>> => {
      return this.apiHlpr.post<Result<ClassesData>>(`home/classes`, obj);
    }
}
