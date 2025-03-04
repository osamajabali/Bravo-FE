import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  private apiResponseSubject = new BehaviorSubject<any>(null);
  apiResponse$ = this.apiResponseSubject.asObservable();

  constructor() { }

  setApiResponse(data: any) {
    this.apiResponseSubject.next(data);
  }
}
