import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { SubLevelReading } from '../../../core/models/reading-models/level-reading.model';
import { SublevelReading, SublevelReadingResponse } from '../../../core/models/reading-models/sub-level-reading.model';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { LeveldReadingService } from '../../../core/services/teacher-dashboard-services/leveld-reading.service';
import { LeveledBookSummaryComponent } from '../../../shared/components/leveled-book-summary/leveled-book-summary.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SkillSummaryData } from '../../../shared/components/skill-summary/skill-summary.component';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';
import { TranslateModule } from '@ngx-translate/core';

interface Book {
  id: number;
  image: string;
  title: string;
  authorName: string;
  status: 'Active' | 'Hidden';
  numberOfPages: number;
  isDisabled?: boolean;
}

@Component({
  selector: 'app-books-grid',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    PaginationComponent,
    LeveledBookSummaryComponent,
    TranslateModule
  ],
  templateUrl: './books-grid.component.html',
  styleUrl: './books-grid.component.scss',
})
export class BooksGridComponent implements OnInit, OnDestroy {

  bookSummaryData: SkillSummaryData = {
    allSkills: 0,
    activeSkills: 0,
    questionSolved: 0,
    timeSpent: 0,
  };

  first: number = 0;
  rows: number = 10;
  totalRecords: number = 0;
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  subLevelReadingFilter: SubLevelReading = new SubLevelReading();
  subLevelReadingResponse: SublevelReadingResponse = new SublevelReadingResponse();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private readingService: LeveldReadingService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem('selectedItems')) {
      this.subLevelReadingFilter.readingSubLevelId = this.sharedService.getId('readingSublevelId');
      this.getBooks();
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }

  getBooks() {
    this.spinnerService.show();
    if (this.sharedService.getPageState('BooksGridComponent')) {
      let pageNumber = this.sharedService.getPageState('BooksGridComponent');
      this.subLevelReadingFilter.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.subLevelReadingFilter.pageSize;
    }

    this.readingService.getSubLevelReading(this.subLevelReadingFilter).subscribe(res => {
      if (res.success) {
        this.spinnerService.hide();
        this.subLevelReadingResponse = res.result;
      }
    });
  }

  nextPage($event: PaginatorState) {
    this.subLevelReadingFilter.pageNumber = $event.page;
    this.sharedService.savePageState('BooksGridComponent', $event.page);
    this.first = $event.first;
    this.getBooks();
  }

  viewBook(book: SublevelReading): void {
    this.sharedService.pushTitle(book.title + '- Book Details');
    this.sharedService.saveId('bookId', book.storyId)
    this.router.navigate(['/features/book-details']);
  }

  sendAssignment(bookId: number): void {
    // TODO: Implement send assignment functionality
    console.log('Sending assignment for book:', bookId);
  }
}
