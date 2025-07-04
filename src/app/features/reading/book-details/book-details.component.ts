import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMenuModule } from 'primeng/tabmenu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { MenuItem } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ImageDialogComponent } from '../../../shared/components/image-dialog/image-dialog.component';
import { BookInfoComponent } from '../tabs/book-info/book-info.component';
import { BookQuestionsComponent } from '../tabs/book-questions/book-questions.component';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { LeveldReadingService } from '../../../core/services/teacher-dashboard-services/leveld-reading.service';
import { StorySummarry } from '../../../core/models/reading-models/story-summary.model';
import { StoryDetails } from '../../../core/models/reading-models/story-details.model';
import { QuestionsResponse } from '../../../core/models/reading-models/questions.model';
import { HtmlDialogComponent } from "../../../shared/components/html-dialog/html-dialog.component";

export class BookDetail {
  subject: string = '';
  title: string = '';
  coverImage: string = '';
}

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [
    CommonModule,
    TabMenuModule,
    ButtonModule,
    DialogModule,
    GalleriaModule,
    BookInfoComponent,
    BookQuestionsComponent,
    FormsModule,
    HtmlDialogComponent
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  activeTab: string = 'book-details';
  showReader: boolean = false;
  activeIndex = 0;

  book: BookDetail = {
    subject: 'Arabic',
    title: 'القراءة للمبتدئين - المستوى الأول',
    coverImage: 'assets/images/book-image.svg'
  };

  tabs: MenuItem[] = [
    { label: 'Book Details', icon: 'pi pi-book' },
    { label: 'Questions', icon: 'pi pi-question-circle' },
    { label: 'Comprehension Skills', icon: 'pi pi-chart-bar' }
  ];

  storySummarry: StorySummarry = new StorySummarry();
  storyDetails: StoryDetails = new StoryDetails();
  questions: QuestionsResponse = new QuestionsResponse();

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private headerService: HeaderService,
    private leveldReadingService: LeveldReadingService
  ) { }

  ngOnInit(): void {
    this.storySummarry.storyId = this.sharedService.getId('bookId');
    if (localStorage.getItem('selectedItems')) {
      this.getStoryDetails();
      this.getQuestions();
    }
    let check = this.sharedService.getSelectedItems()?.selectedGradeId == null;
    this.refreshSubscription = this.sharedService.refresh$.subscribe(res => {
      if (((res == 'trigger') && check) || res == 'refresh') {
        
      }
    });
    this.refreshSubscription = this.sharedService.refresh$.subscribe((res) => {
      if (res) {
        this.route.paramMap.subscribe((params) => {
        });
      }
    });
  }
  
  getQuestions() {
    this.storySummarry.courseSectionId = this.sharedService.getSelectedItems().selectedSectionId;
    this.leveldReadingService.getQuestions(this.storySummarry).subscribe((res) => {
      if (res.success) {
        this.questions = res.result;
      }
    });
  }
  
  getStoryDetails() {
    this.storySummarry.courseSectionId = this.sharedService.getSelectedItems().selectedSectionId;
    this.leveldReadingService.getStoryDetails(this.storySummarry).subscribe((res) => {
      if (res.success) {
        this.storyDetails = res.result;
      }
    });
  }

  readNow() {
    this.showReader = true;
  }

  // Cleanup when component is destroyed
  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
}
