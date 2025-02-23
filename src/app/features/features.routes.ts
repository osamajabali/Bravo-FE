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
      {
        path: 'leveled-reading',
        loadComponent: () =>
          import(
            './teacher-dashboard/leveled-reading/leveled-reading.component'
          ).then((m) => m.LeveledReadingComponent),
      },
      {
        path: 'leveled-display',
        loadComponent: () =>
          import(
            './teacher-dashboard/leveled-display/leveled-display.component'
          ).then((m) => m.LeveledDisplayComponent),
      },
      {
        path: 'questions',
        loadComponent: () =>
          import(
            './teacher-dashboard/questions/questions.component'
          ).then((m) => m.QuestionsComponent),
      },
    ],
  },
];
