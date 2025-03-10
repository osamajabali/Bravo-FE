import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageTitleService {
  private pageTitleSubject = new BehaviorSubject<string>('');
  private isBackButtonVisible = new BehaviorSubject<boolean>(false);

  constructor() {}

  /**
   * Get the current page title as an Observable
   */
  getPageTitle(): Observable<string> {
    return this.pageTitleSubject.asObservable();
  }

  /**
   * Set a new page title
   * @param title The new page title
   */
  setPageTitle(title: string): void {
    this.pageTitleSubject.next(title);
  }

  /**
   * Get the current page title value
   */
  getCurrentPageTitle(): string {
    return this.pageTitleSubject.getValue();
  }

  /**
   * Get the visibility of the back button as an Observable
   */
  getBackButtonVisibility(): boolean {
    return this.isBackButtonVisible.getValue();
  }

  /**
   * Set the visibility of the back button
   * @param show Whether to show the back button
   */
  setBackButtonVisibility(show: boolean): void {
    this.isBackButtonVisible.next(show);
  }
}
