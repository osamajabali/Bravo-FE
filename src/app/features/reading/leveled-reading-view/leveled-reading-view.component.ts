import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { Subscription } from 'rxjs';
import { PaginatorState } from 'primeng/paginator';
import { LevelReadingResponseArray, LevelReadingResponse } from '../../../core/models/reading-models/level-reading-response.model';
import { LevelReading } from '../../../core/models/reading-models/level-reading.model';
import { MainLevels } from '../../../core/models/reading-models/main-levels';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { LeveldReadingService } from '../../../core/services/teacher-dashboard-services/leveld-reading.service';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { SpinnerService } from '../../../core/services/shared-services/spinner.service';

@Component({
  selector: 'app-leveled-reading-view',
  standalone: true,
  imports: [
    CommonModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    PaginationComponent
  ],
  templateUrl: './leveled-reading-view.component.html',
  styleUrl: './leveled-reading-view.component.scss'
})
export class LeveledReadingViewComponent implements OnInit, OnDestroy {
  selectedLevel: any = null;
  searchTerm: string = '';
  mainLevels: MainLevels[] = [{ mainLevelId: 0, subLevelId: 0, name: 'All levels', order: 0 }];
  levelReading: LevelReading = new LevelReading();
  levelReadingResponse: LevelReadingResponseArray = new LevelReadingResponseArray();
  levels = [
    { label: 'Level A', value: 'a' },
    { label: 'Level B', value: 'b' },
    { label: 'Level C', value: 'c' },
    { label: 'Level D', value: 'd' }
  ];

  private refreshSubscription!: Subscription;
  first: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private readingService: LeveldReadingService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
          this.getMainLevels();
          this.getReadings();
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe(); // Unsubscribe to avoid memory leaks
    }
  }

  getReadings() {
    this.spinnerService.show();
    if (this.sharedService.getPageState('LeveledReadingViewComponent')) {
      let pageNumber = this.sharedService.getPageState('LeveledReadingViewComponent');
      this.levelReading.pageNumber = pageNumber;
      this.first = (pageNumber - 1) * this.levelReading.pageSize;
    }

    this.readingService.getLevelReading(this.levelReading).subscribe(res => {
      if (res.success) {
        this.spinnerService.hide();
        this.levelReadingResponse = res.result;
      }
    });
  }

  getMainLevels() {
    this.readingService.getMainLevels().subscribe((res) => {
      if (res.success) {
        const allLevels = { mainLevelId: 0, subLevelId: 0, name: 'All Levels', order: 0 };
        this.mainLevels = [allLevels, ...res.result];
      }
    });
  }

  nextPage($event: PaginatorState) {
    this.levelReading.pageNumber = $event.page;
    this.sharedService.savePageState('LeveledReadingViewComponent', $event.page);
    this.first = $event.first;
    this.getReadings();
  }

  viewBooks(book: LevelReadingResponse) {
    this.sharedService.pushTitle(book.name + '- Books');
    this.router.navigate(['/features/leveled-reading/books-grid', book.readingSubLevelId]);
  }

  onSearchChange() {
    // TODO: Implement search logic
  }
}
