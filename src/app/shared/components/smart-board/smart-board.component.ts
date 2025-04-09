import { Component, Input, Output, EventEmitter, OnInit, Resource } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CardService } from '../../../core/services/skills/card-service.service';
import { CardRequest, CardResponse } from '../../../core/models/teacher-dashboard-models/card.model';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { Subscription } from 'rxjs';
import { SharedService } from '../../../core/services/shared-services/shared.service';
import { ImageDialogComponent } from "../image-dialog/image-dialog.component";
import { FormsModule } from '@angular/forms';
import { ResourceTypeEnum } from '../../../core/models/shared-models/enums';
import { Resources } from '../../../core/models/shared-models/resources.model';
import { BookDetail } from '../../../features/reading/book-details/book-details.component';

@Component({
  selector: 'app-smart-board',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule, ImageDialogComponent , FormsModule],
  templateUrl: './smart-board.component.html',
  styleUrl: './smart-board.component.scss'
})
export class SmartBoardComponent implements OnInit {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Input() skillId: number = 0;
  @Input() skillTitle: string = '';
  @Input() title: string = '';
  @Input() learningOutcomeId : number = 0;
  card : CardRequest = new CardRequest();
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  
  showImageDialog : boolean = false;
  cardResponse: CardResponse[] = [];
  resourceType = ResourceTypeEnum;
  resources : Resources = new Resources();
  
  book: BookDetail = new BookDetail();

  constructor(private cardService : CardService, private headerService : HeaderService, private sharedService : SharedService){}

  ngOnInit(): void {
    this.getCards()
}
  getCards() {
    this.card.courseSectionId = this.headerService.selectedSectionId;
    this.card.learningOutcomeId = 101050;
    this.cardService.getCards(this.card).subscribe(res =>{
      if(res.success){
        this.cardResponse = res.result
      }
  })
  }

  openCardPerType = (id : number) =>{
    if(this.resources.flashCards){
      this.showImageDialog = true
    }
  }

  getResources(card : CardResponse) {
    this.card.resourceTypeId = card.resourceTypeId;
    this.book.title = this.title;
    this.cardService.getResources(this.card).subscribe(res =>{
      if(res.success){
        this.resources = res.result;
        this.openCardPerType(card.resourceTypeId);
      }
  })
  }

  closeBoard(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
} 