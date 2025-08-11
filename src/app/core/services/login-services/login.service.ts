import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../models/login-models/access-token';
import { LoggedInUser, Role } from '../../models/login-models/logged-in-user';
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

  decodeToken = () => {
    if (!this.isLoggedIn()) return null;
    
    try {
      const token = this.getAccessToken();
      if (!token) return null;
      
      return jwtDecode(token) as AccessToken;
    } catch (error) {
      console.warn('Failed to decode token:', error);
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem("_accessToken");
      }
      return null;
    }
  }

  getAccessToken = (): string | null => {
    return typeof window !== 'undefined' ? localStorage.getItem("_accessToken") : null;
  }

  isTokenExpired(): boolean {
    if (!this.isLoggedIn()) return true; // No token = Expired

    try {
      const user = this.getUser();
      if (!user || !user.exp) return true; // If there's no expiration field, treat it as expired

      const now = Math.floor(Date.now() / 1000);
      return user.exp < now; // Token is expired if exp time is in the past
    } catch (error) {
      console.warn('Error checking token expiration:', error);
      return true; // If decoding fails, assume token is invalid/expired
    }
  }

  autoLogout() {
    try {
      if (!this.isLoggedIn()) return;
      
      const user = this.getUser();
      if (!user || !user.exp) return;

      const expDate = new Date(user.exp * 1000);
      const now = new Date();

      const timeout = expDate.getTime() - now.getTime();

      if (timeout > 0) {
        setTimeout(() => {
          this.logout();
        }, timeout);
      } else {
        this.logout();
      }
    } catch (error) {
      console.warn('Error in autoLogout:', error);
      // If there's an error, just logout to be safe
      this.logout();
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
