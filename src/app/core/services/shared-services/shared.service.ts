import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private refreshSubject = new Subject<void>();
  private apiResponseSubject = new BehaviorSubject<any>(null);
  apiResponse$ = this.apiResponseSubject.asObservable();
  refresh$ = this.refreshSubject.asObservable();


  constructor() { }

  setApiResponse(data: any) {
    this.apiResponseSubject.next(data);
  }

  triggerRefresh() {
    this.refreshSubject.next();
  }
}
