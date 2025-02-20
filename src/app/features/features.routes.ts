import { Routes } from '@angular/router';
import { authGuard } from '../core/services/auth.guard';

export const Features_Routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full', // Ensures the path matches the full URL
  },
  // صفحة تسجيل الدخول (Login)
  {
    path: 'login',
    loadComponent: () =>
      import('./authentication/login/login.component').then(
        (m) => m.LoginComponent
      ), // Correctly lazy-loads the LoginComponent
  },
  {
    path: 'features',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./main-layout/layout/layout.component').then(
        (m) => m.LayoutComponent
      ), // Ensure you're loading the correct parent component for "pages"
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./main-layout/main.routes').then(
            (m) => m.MainFeatures_Routes
          ),
      },
    ],
  },
  {
    path: 'dashboard',
    // canActivate: [authGuard],
    loadChildren: () =>
      import('./teacher-dashboard/teacher-dashboard.module').then(
        (m) => m.TeacherDashboardModule
      ), // Lazy-load the TeacherDashboardModule
  },
];
