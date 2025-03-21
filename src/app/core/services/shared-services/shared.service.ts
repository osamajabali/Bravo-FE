import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PaginationFilter } from '../../models/shared-models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  nextRoute : string;
  pagination : PaginationFilter = new PaginationFilter();
  private refreshSubject = new Subject<any>(); // Changed from void to any
  private apiResponseSubject = new BehaviorSubject<any>(null);
  
  apiResponse$ = this.apiResponseSubject.asObservable();
  refresh$ = this.refreshSubject.asObservable();

  constructor() { }
  
  triggerRefresh(data: any) { // Accept data as a parameter
    this.refreshSubject.next(data); // Emit data with the refresh event
  }
}
