import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../login-services/login.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService: LoginService = inject(LoginService);
  const router: Router = inject(Router);
  if (!authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  if (authService.isTokenExpired()) {
    authService.logout();
    return false;
  }

  return true;
};