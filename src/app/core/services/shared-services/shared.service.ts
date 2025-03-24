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

  getTitle(): string {
    if(JSON.parse(localStorage.getItem('title'))){
    let titleArray =  JSON.parse(localStorage.getItem('title'))
    let arrayLastIndex =  titleArray.length? titleArray.length - 1 : 0;
   return JSON.parse(localStorage.getItem('title'))[arrayLastIndex]
  }else{
    return ''
  }
  }

  pushTitle = (title : string) => {
    let titleArray : string[] =  JSON.parse(localStorage.getItem('title')) ? JSON.parse(localStorage.getItem('title')) : [title]
    titleArray.push(title);
    localStorage.setItem('title' , JSON.stringify(titleArray));
    this.getTitle()
  }

  popTitle = () =>{
    let titleArray : string[] =  JSON.parse(localStorage.getItem('title')) ? JSON.parse(localStorage.getItem('title')) : ['']
    titleArray.pop();
    localStorage.setItem('title' , JSON.stringify(titleArray));
    this.getTitle()
  }
}
