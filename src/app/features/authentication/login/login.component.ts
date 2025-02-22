import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LogIn } from '../../../core/models/login-models/login.model';
import { LoginService } from '../../../core/services/login-services/login.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule , RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user: LogIn = new LogIn();

	constructor(private router : Router , private loginService : LoginService) {}
  
	ngOnInit(): void {

	}
  
	// Submit handler for the form
	onSubmit(loginForm : NgForm): void {
    this.router.navigate(['/features']);
    
		if(loginForm.invalid){
			return
		}
		
		// this.loginService.login(this.user).pipe(
		// 	finalize(() => {})
		//   ).subscribe(response => {
		// 	if (response) {
		// 	  this.loginService.setUser(response.result.token);
		// 	  this.router.navigate(['/features'])
		// 	  }
		// 	  else{
		// 		console.log('WRONG_EMAIL_OR_PASSWORD')
		// 	  }
		// 	}
		//   )
	}
}
