import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../models/login-models/access-token';
import { LoggedInUser } from '../../models/login-models/logged-in-user';
import { LogIn } from '../../models/login-models/login.model';
import { HttpService } from '../shared-services/http.service';
import { Result } from '../../models/shared-models/result';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  calledRequests = [];

  constructor(private apiHlpr: HttpService , private router: Router) { }

  login = (obj: LogIn): Observable<Result<LoggedInUser>> => {
    return this.apiHlpr.post<Result<LoggedInUser>>(`auth/login`, obj);
  }

  changePassword = (obj: any): Observable<LoggedInUser> => {
    return this.apiHlpr.put<LoggedInUser>(`Account/change-password`, obj);
  }

  setUser = (accessToken: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("_accessToken", accessToken);
    }
  }

  isLoggedIn = (): boolean => {
    return typeof window !== 'undefined' && !!localStorage.getItem("_accessToken");
  }

  getUser = (): AccessToken | null => {
    return this.isLoggedIn() ? (this.decodeToken()) as unknown as AccessToken : null;
  }

  decodeToken = () =>
    this.isLoggedIn() ? jwtDecode(this.getAccessToken()!) as AccessToken : null;

  getAccessToken = (): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem("_accessToken") : null;
  }

  isTokenExpired(): boolean {
    if (!this.getUser()) return true; // No token = Expired

    try {
      const exp = this.getUser().exp;

      if (!exp) return true; // If there's no expiration field, treat it as expired

      const now = Math.floor(Date.now() / 1000);
      return exp < now; // Token is expired if exp time is in the past
    } catch (error) {
      return true; // If decoding fails, assume token is invalid/expired
    }
  }

  autoLogout() {
    if (this.getUser()) {
      const exp = this.getUser().exp;

      if (exp) {
        const expDate = new Date(exp * 1000);
        const now = new Date();

        const timeout = expDate.getTime() - now.getTime();

        if (timeout > 0) {
          setTimeout(() => {
            this.logout();
          }, timeout);
        } else {
          this.logout();
        }
      }
    }
  }

  // Logout the user and redirect to home
  logout() {
    if (typeof window !== 'undefined' && localStorage && this.isTokenExpired()) {
      localStorage.clear();
      localStorage.setItem('sessionMessage', 'Your session has expired.');
    }else{
      localStorage.clear();
    }
    this.router.navigate(['/']);
  }
}
