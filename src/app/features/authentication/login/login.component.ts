import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LogIn } from '../../../core/models/login-models/login.model';
import { LoginService } from '../../../core/services/login-services/login.service';
import { finalize, catchError, of } from 'rxjs';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { PasswordModule } from 'primeng/password';
import { AlertService } from '../../../core/services/shared-services/alert.service';
import { TranslateModule } from '@ngx-translate/core';
import { AutoFormErrorDirective } from '../../../shared/functions/directives/auto-form-error.directive';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, PasswordModule, TranslateModule, AutoFormErrorDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user: LogIn = new LogIn();
  sessionMessage: string | null = null;
  keepMeLoggedIn: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private headerService: HeaderService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.sessionMessage = localStorage.getItem('sessionMessage');
      if (this.sessionMessage) {
        this.alertService.info(this.sessionMessage);
        localStorage.removeItem('sessionMessage');
      }
    }
  }

  // Check if form is valid for submission
  isFormValid(): boolean {
    return this.user.username && 
           this.user.username.trim() !== '' && 
           this.user.username.trim().length >= 2 &&
           this.user.password && 
           this.user.password.length >= 4;
  }

  // Submit handler for the form
  onSubmit(loginForm: NgForm): void {
    // Check form validity first
    if (!this.isFormValid()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.loginService
      .login(this.user)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        catchError((error) => {
          this.handleLoginError(error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response && response.result && Object.keys(response.result).length > 0) {
          // Success - user has valid credentials and result contains user data
          this.loginService.setUser(response.result.userToken);
          localStorage.setItem(
            'loginRoles',
            JSON.stringify(response.result.roles)
          );
          localStorage.setItem(
            'roleId',
            response.result.roles[0].roleId.toString()
          );
          localStorage.setItem('userName', response.result.userFullName);
          this.headerService.selectedGradeId = 0;
          this.headerService.selectedSubjectId = 0;
          this.router.navigate(['/features']);
        } else {
          // Authentication failed - API returns success: true but empty result
          // Use the message from the API response if available
          if (response && response.message) {
            this.errorMessage = response.message;
          } else {
            this.errorMessage = 'ERROR.INVALID_CREDENTIALS';
          }
          this.alertService.error('ERROR.INVALID_CREDENTIALS', 'ERROR.AUTHENTICATION_FAILED');
        }
      });
  }

  private handleLoginError(error: any): void {
    console.error('Login error:', error);
    
    // Check if it's an API error response with a specific code
    if (error.error && error.error.code === 8) {
      // API returned error code 8 - incorrect credentials
      this.errorMessage = error.error.message || 'ERROR.INVALID_CREDENTIALS';
      this.alertService.error('ERROR.INVALID_CREDENTIALS', 'ERROR.AUTHENTICATION_FAILED');
      return;
    }
    
    // Handle HTTP status errors
    if (error.status === 401) {
      this.errorMessage = 'ERROR.INVALID_CREDENTIALS';
      this.alertService.error('ERROR.INVALID_CREDENTIALS', 'ERROR.AUTHENTICATION_FAILED');
    } else if (error.status === 400) {
      this.errorMessage = 'ERROR.INVALID_REQUEST';
      this.alertService.error('ERROR.INVALID_REQUEST', 'ERROR.INVALID_REQUEST_TITLE');
    } else if (error.status === 500) {
      this.errorMessage = 'ERROR.SERVER_ERROR';
      this.alertService.error('ERROR.SERVER_ERROR', 'ERROR.SERVER_ERROR_TITLE');
    } else if (error.status === 0 || error.status === 404) {
      this.errorMessage = 'ERROR.CONNECTION_ERROR';
      this.alertService.error('ERROR.CONNECTION_ERROR', 'ERROR.CONNECTION_ERROR_TITLE');
    } else if (error.name === 'NetworkError' || error.message?.includes('Network Error')) {
      this.errorMessage = 'ERROR.CONNECTION_ERROR';
      this.alertService.error('ERROR.CONNECTION_ERROR', 'ERROR.CONNECTION_ERROR_TITLE');
    } else {
      this.errorMessage = 'ERROR.UNEXPECTED_ERROR';
      this.alertService.error('ERROR.UNEXPECTED_ERROR', 'ERROR.UNEXPECTED_ERROR_TITLE');
    }
  }

  // Clear error message when user starts typing
  onInputChange(): void {
    if (this.errorMessage) {
      // Clear validation errors when user starts typing
      if (this.errorMessage.includes('REQUIRED') || 
          this.errorMessage.includes('TOO_SHORT') || 
          this.errorMessage.includes('VALIDATION_ERROR')) {
        this.errorMessage = null;
      }
    }
  }

  // Empty function for forget password functionality
  onForgetPassword(event: Event): void {
    event.preventDefault();
    // TODO: Implement forget password functionality
  }
}
