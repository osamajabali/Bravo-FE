import { Injectable } from '@angular/core';
import { HttpService } from '../shared-services/http.service';
import { Result } from '../../models/shared-models/result';
import {
  CardRequest,
  CardResponse,
} from '../../models/teacher-dashboard-models/card.model';
import { Observable } from 'rxjs';
import { Resources } from '../../models/shared-models/resources.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  constructor(private apiHlpr: HttpService) {}

  getCards = (card: CardRequest): Observable<Result<CardResponse[]>> => {
    return this.apiHlpr.post<Result<CardResponse[]>>(`resource-types`, card);
  };

  getResources = (card: CardRequest): Observable<Result<Resources>> => {
    return this.apiHlpr.post<Result<Resources>>(`resources`, card);
  };
}
