import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../models/login-models/access-token';
import { LoggedInUser } from '../../models/login-models/logged-in-user';
import { LogIn } from '../../models/login-models/login.model';
import { HttpService } from '../shared-services/http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  calledRequests = [];

  constructor(private apiHlpr: HttpService) { }

  login = (obj: LogIn): Observable<LoggedInUser> => {
    return this.apiHlpr.post<LoggedInUser>(`Auth`, obj);
  }

  changePassword = (obj: any): Observable<LoggedInUser> => {
    return this.apiHlpr.put<LoggedInUser>(`Account/change-password`, obj);
  }

  setUser = (accessToken: string): void => localStorage.setItem("_accessToken", accessToken);

  isLoggedIn = (): boolean => !!localStorage.getItem("_accessToken");

  getUser = (): AccessToken | null => this.isLoggedIn() ? (this.decodeToken()) as unknown as AccessToken : null;

  decodeToken = () =>
    this.isLoggedIn() ? jwtDecode(this.getAccessToken()!) as AccessToken : null;

  getAccessToken = (): string | null => localStorage.getItem("_accessToken");

}
