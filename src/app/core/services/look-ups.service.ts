import { Injectable } from '@angular/core';
import { HttpService } from '../../../assets/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LookUpsService {
  controller: string = 'Lookups';

  constructor(private httpService : HttpService) { }

    getAllUser = () => {
      return this.httpService.get<{id : string , fullName : string}[]>(`${this.controller}/users`);
    }
  

    getAllProjects = () => {
      return this.httpService.get<{id : string , name : string}[]>(`${this.controller}/projects`);
    }
  
}
