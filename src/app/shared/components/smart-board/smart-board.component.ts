import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Resource,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardService } from '../../../core/services/skills/card-service.service';
import {
  CardRequest,
  CardResponse,
} from '../../../core/models/teacher-dashboard-models/card.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { VideoDialogComponent } from '../video-dialog/video-dialog.component';
import { PdfDialogComponent } from '../pdf-dialog/pdf-dialog.component';
import { FormsModule } from '@angular/forms';
import { ResourceTypeEnum } from '../../../core/models/shared-models/enums';
import { Resources } from '../../../core/models/shared-models/resources.model';
import { BookDetail } from '../../../features/teacher-dashboard/leveled-reading/book-details/book-details.component';

export enum SmartBoardResourceId {
  Videos = 2,
  FlashCards = 6,
  Questions = 8,
  RelatedBooks = 9,
  Worksheets = 10,
}

interface ResourceItem {
  url: string;
  type: string;
}

@Component({
  selector: 'app-smart-board',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    ImageDialogComponent,
    VideoDialogComponent,
    PdfDialogComponent,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './smart-board.component.html',
  styleUrl: './smart-board.component.scss',
})
export class SmartBoardComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() skillId: number = 0;
  @Input() skillTitle: string = '';
  @Input() title: string = '';
  @Input() learningOutcomeId: number = 0;
  
  card: CardRequest = new CardRequest();
  private refreshSubscription!: Subscription;

  showImageDialog: boolean = false;
  showVideoDialog: boolean = false;
  showPdfDialog: boolean = false;
  cardResponse: CardResponse[] = [];
  resourceType = ResourceTypeEnum;
  resources: Resources = new Resources();
  currentVideoUrl: string = '';
  currentPdfUrl: string = '';

  book: BookDetail = new BookDetail();

  constructor(
    private cardService: CardService,
    private headerService: HeaderService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getCards();
  }

  getCards() {
    this.card.courseSectionId = this.headerService.selectedSectionId;
    this.card.learningOutcomeId = 101050;
    this.cardService.getCards(this.card).subscribe((res) => {
      if (res.success) {
        this.cardResponse = res.result;
      }
    });
  }

  openCardPerType = (id: number) => {
    switch (id) {
      case SmartBoardResourceId.FlashCards:
        if (this.resources.flashCards) {
          this.showImageDialog = true;
        }
        break;
      case SmartBoardResourceId.Videos:
        if (this.resources.videos?.length > 0) {
          const video = this.resources.videos[0] as unknown as ResourceItem;
          if (video?.url) {
            // We need to attach the video extension to the url 
            // Sample https://www.w3schools.com/html/mov_bbb.mp4
            this.currentVideoUrl = video.url;
            this.showVideoDialog = true;
          }
        }
        break;
      case SmartBoardResourceId.Worksheets:
        if (this.resources.worksheets?.length > 0) {
          const worksheet = this.resources.worksheets[0] as unknown as ResourceItem;
          if (worksheet?.url) {
            // sample 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf'
            this.currentPdfUrl = worksheet?.url;
            this.showPdfDialog = true;
          }
        }
        break;
    }
  };

  getResources(card: CardResponse) {
    this.card.resourceTypeId = card.resourceTypeId;
    this.book.title = this.title;
    this.cardService.getResources(this.card).subscribe((res) => {
      if (res.success) {
        this.resources = res.result;
        this.openCardPerType(card.resourceTypeId);
      }
    });
  }

  closeBoard(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
}
