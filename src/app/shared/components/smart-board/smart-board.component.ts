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
  @Input() learningOutcomeId : number = 0;
  card : CardRequest = new CardRequest();
  private refreshSubscription!: Subscription; // Mark subscription as private to avoid accidental changes
  showImageDialog : boolean = false;
  cardResponse: CardResponse[] = [];
  resourceType = ResourceTypeEnum;
  resources : Resources = new Resources();
  
  book: any = {
    subject: 'Arabic',
    title: 'القراءة للمبتدئين - المستوى الأول',
    coverImage: 'assets/images/book-image.svg'
  };

  constructor(private cardService : CardService, private headerService : HeaderService, private sharedService : SharedService){}

  ngOnInit(): void {
    this.getCards()
}
  getCards() {
    this.card.courseSectionId = this.headerService.selectedSectionId;
    this.card.learningOutcomeId = 101099;
    this.cardService.getCards(this.card).subscribe(res =>{
      if(res.success){
        this.cardResponse = res.result
      }
  })
  }

  openCardPerType = (id : number) =>{
    switch (id) {
      case this.resourceType.FlashCards:
        this.showImageDialog = true;
        break;
      case 2:
        console.log('Handle case for ID 2');
        break;
      case 3:
        console.log('Handle case for ID 3');
        break;
      default:
        console.log('Handle default case');
    }
  }

  getResources(id : number) {
    this.cardService.getResources(this.card).subscribe(res =>{
      if(res.success){
        this.resources = res.result;
        this.openCardPerType(id);
      }
  })
  }

  closeBoard(): void {
    this.visible = false;
    this.visibleChange.emit(this.visible);
  }
} 