import { Routes } from '@angular/router';

export const Features_Routes: Routes = [

  {
    path: '',
    // canActivate: [authGuard],
    loadComponent: () =>
      import('./main-layout/layout/layout.component').then(
        (m) => m.LayoutComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./teacher-dashboard/stats/stats.component').then(
            (m) => m.StatsComponent
          ),
      },
      {
        path: 'units',
        loadComponent: () =>
          import('./teacher-dashboard/units/units.component').then(
            (m) => m.UnitsComponent
          ),
      },
      {
        path: 'single-skill',
        loadComponent: () =>
          import(
            './teacher-dashboard/single-skill/single-skill.component'
          ).then((m) => m.SingleSkillComponent),
      },
    ],
  },
];
