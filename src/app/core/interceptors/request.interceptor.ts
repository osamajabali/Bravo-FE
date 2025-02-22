import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from '../services/shared-services/alert.service';

export const RequestInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);
  let token = null;

  if (typeof window !== 'undefined') {
    token = localStorage.getItem('auth_token');
  }

  const modifiedRequest = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Interceptor error:', error.message || error.statusText);

      if (error.error?.errors?.length) {
        alertService.error(error.error.errors[1], error.error.errors[0]);
      } else {
        alertService.error('An unexpected error occurred.');
      }

      return throwError(() => error);
    })
  );
};
