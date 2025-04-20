import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { DetailedFilter } from '../../../core/models/reading-models/detailed-filter.model';
import { MainLevels } from '../../../core/models/reading-models/main-levels';
import { ReadingFilter } from '../../../core/models/reading-models/reading-filter.model';
import { StoriesList, Story } from '../../../core/models/reading-models/stories.model';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { LeveldReadingService } from '../../../core/services/teacher-dashboard-services/leveld-reading.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';

@Component({
  selector: 'app-book-list-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FormsModule,
    PaginationComponent
  ],
  templateUrl: './book-list-view.component.html',
  styleUrls: ['./book-list-view.component.scss']
})
export class BookListViewComponent implements OnInit, OnDestroy {
  // Search and filters
  searchQuery: string = '';
  showAdvancedSearch = false;

  // Basic filters
  mainLevels: MainLevels[] = [{ mainLevelId: 0, subLevelId : 0, name: 'All levels', order: 0 }];
  subLevels: MainLevels[] = [];
  detailedFilter: DetailedFilter = new DetailedFilter();

  // Pagination
  first: number = 0;

  // Books data
  books: StoriesList = new StoriesList();

  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  readingFilter: ReadingFilter = new ReadingFilter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private readingService: LeveldReadingService,
    private spinnerService : SpinnerService
  ) {}

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          this.getMainLevels();
          this.getFilters();
          this.getStories();
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getFilters() {
    this.readingService.getFilters(0, 0).subscribe((res) => {
      if (res.success) {
        this.detailedFilter = res.result;
      }
    });
  }

  getMainLevels() {
    this.readingService.getMainLevels().subscribe((res) => {
      if (res.success) {
        const allLevels = { mainLevelId: 0, subLevelId : 0, name: 'All Levels', order: 0 };
        this.mainLevels = [allLevels, ...res.result];
      }
    });
  }

  getStories() {
    this.spinnerService.show();
    if (this.sharedService.getPageState('BookListComponent')) {
      let pageNumber = this.sharedService.getPageState('BookListComponent');
      this.readingFilter.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.readingFilter.pageSize;
    }

    this.readingService.getStories(this.readingFilter).subscribe((res) => {
      if (res.success) {
        this.spinnerService.hide()
        this.books = res.result;
      }
    });
  }


  onMainLevelChange() {
    this.readingFilter.readingSubLevelId = 0 ;
    this.sharedService.savePageState('BookListComponent', 1);
    this.readingService.getSubLevels(this.readingFilter.readingMainLevelId).subscribe((res) => {
      if (res.success) {
        this.getStories();
        const allLevels = { mainLevelId: 0, name: 'All Sub Levels', order: 0 };
        this.subLevels = [allLevels, ...res.result];
      }
    });
  }

    viewBook(book: Story) {
      this.sharedService.pushTitle(book.title + '- Books');
      this.sharedService.saveId('bookId' , book.storyId)
      this.router.navigate(['/features/book-details']);
    }

  onSubLevelChange() {
    this.sharedService.savePageState('BookListComponent', 1);
    this.getStories();
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }

  onAdvancedSearch() {
    this.showAdvancedSearch = false;
  }

  onCancelAdvancedSearch() {
    this.showAdvancedSearch = false;
    this.readingFilter.learningOutcomeId = 0;
    this.readingFilter.gradeId = 0;
    this.readingFilter.subjectId = 0;
    this.readingFilter.learningHubId = 0;
    this.readingFilter.ibLearnerProfileId = 0;
    this.readingFilter.genreId = 0;
    this.readingFilter.authorId = 0;
    this.readingFilter.publisherId = 0;
    this.readingFilter.illustratorId = 0;
    this.readingFilter.ageGroupId = 0;
    this.getStories();
  }

  onResetAdvancedSearch() {
    this.showAdvancedSearch = false;
    this.readingFilter.learningOutcomeId = 0;
    this.readingFilter.gradeId = 0;
    this.readingFilter.subjectId = 0;
    this.readingFilter.learningHubId = 0;
    this.readingFilter.ibLearnerProfileId = 0;
    this.readingFilter.genreId = 0;
    this.readingFilter.authorId = 0;
    this.readingFilter.publisherId = 0;
    this.readingFilter.illustratorId = 0;
    this.readingFilter.ageGroupId = 0;
    this.getStories();
  }

  nextPage($event: PaginatorState) {
    this.readingFilter.pageNumber = $event.page;
    this.sharedService.savePageState('BookListComponent', $event.page);
    this.first = $event.first;
    this.getStories();
  }
}
