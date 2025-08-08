import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LogIn } from '../../../core/models/login-models/login.model';
import { LoginService } from '../../../core/services/login-services/login.service';
import { finalize } from 'rxjs';
import { HeaderService } from '../../../core/services/header-services/header.service';
import { PasswordModule } from 'primeng/password';


@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule, PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  user: LogIn = new LogIn();
  sessionMessage: string | null = null;
  keepMeLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private headerService: HeaderService
  ) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage) {
      this.sessionMessage = localStorage.getItem('sessionMessage');
      if (this.sessionMessage) {
        alert(this.sessionMessage);
        localStorage.removeItem('sessionMessage');
        localStorage.removeItem('sessionMessage');
      }
    }
  }

  // Submit handler for the form
  onSubmit(loginForm: NgForm): void {
    if (loginForm.invalid) {
      return;
    }

    this.loginService
      .login(this.user)
      .pipe(finalize(() => {}))
      .subscribe((response) => {
        if (response) {
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
          console.log('WRONG_EMAIL_OR_PASSWORD');
        }
      });
  }

  // Empty function for forget password functionality
  onForgetPassword(event: Event): void {
    event.preventDefault();
    // TODO: Implement forget password functionality
  }
}
