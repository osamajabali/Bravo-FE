import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PaginationFilter } from '../../models/shared-models/pagination.model';
import { TranslateService } from '@ngx-translate/core';
import { ClassesData } from '../../models/header-models/header.model';
import { SelectedItems } from '../../models/header-models/selected-items.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  nextRoute: string = '/features/skills/skills-level-three';
  pagination: PaginationFilter = new PaginationFilter();
  private refreshSubject = new Subject<string>(); // Changed from void to any
  private apiResponseSubject = new BehaviorSubject<any>(null);
  translateService = inject(TranslateService)
  apiResponse$ = this.apiResponseSubject.asObservable();
  refresh$ = this.refreshSubject.asObservable();

  constructor() { }

  triggerRefresh(data: string) { // Accept data as a parameter
    this.refreshSubject.next(data); // Emit data with the refresh event
  }

  getTitle(): string {
    if (JSON.parse(localStorage.getItem('title'))) {
      let titleArray = JSON.parse(localStorage.getItem('title'))
      let arrayLastIndex = titleArray.length ? titleArray.length - 1 : 0;
      return JSON.parse(localStorage.getItem('title'))[arrayLastIndex]
    } else {
      return ''
    }
  }

  pushTitle = (title: string) => {
    let titleArray: string[] = JSON.parse(localStorage.getItem('title')) ? JSON.parse(localStorage.getItem('title')) : ['']
    titleArray.push(title);
    localStorage.setItem('title', JSON.stringify(titleArray));
    this.getTitle()
  }

  popTitle = () => {
    let titleArray: string[] = JSON.parse(localStorage.getItem('title')) ? JSON.parse(localStorage.getItem('title')) : ['']
    titleArray.pop();
    localStorage.setItem('title', JSON.stringify(titleArray));
    this.getTitle()
  }

  removeArray = () =>{
    localStorage.removeItem('title');
  }

  translate = (translatedText: string): string => {
    return this.translateService.instant(translatedText)
  }

  // Save pagination state for a specific component
  savePageState(componentName: string, page: number): void {
    sessionStorage.setItem(componentName, page.toString());
  }

  // Retrieve pagination state for a specific component
  getPageState(componentName: string): number {
    const page = sessionStorage.getItem(componentName);
    return page ? parseInt(page) : 1; // Return 1 if no page state exists
  }

  // Save pagination state for a specific component
  saveId(idName: string, page: number): void {
    sessionStorage.setItem(idName, page.toString());
  }

  // Retrieve pagination state for a specific component
  getId(idName: string): number {
    const page = sessionStorage.getItem(idName);
    return page ? parseInt(page) : 0; // Return 1 if no page state exists
  }

    getSelectedItems = (): SelectedItems | null => {
      return localStorage.getItem('selectedItems') ? JSON.parse(localStorage.getItem('selectedItems')) as unknown as SelectedItems : null;
    }
}
