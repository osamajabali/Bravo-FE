import { Routes } from '@angular/router';

export const Main_Layout_Routes: Routes = [
    {
        path: '',
        // canActivate: [authGuard],
        loadComponent: () =>
          import('../main-layout/layout/layout.component').then(
            (m) => m.LayoutComponent
          ),
        children: [
          {
            path: '',
            data: { title: 'LEARNING_OUTCOMES' }, // ✅ Pass title here
            loadComponent: () =>
              import('../teacher-dashboard/stats/stats.component').then(
                (m) => m.StatsComponent
              ),
          },
          {
            path: 'units-stats',
            data: { title: 'SKILLS' }, // ✅ Pass title here
            loadComponent: () =>
              import('../teacher-dashboard/stats/stats.component').then(
                (m) => m.StatsComponent
              ),
          },
          {
            path: 'units',
            data: { title: 'UNITS' }, // ✅ Pass title here
            loadComponent: () =>
              import('../teacher-dashboard/units/units.component').then(
                (m) => m.UnitsComponent
              ),
          },
          {
            path: 'lessons/:id',
            data: { title: 'LESSONS' },
            loadComponent: () =>
              import('../teacher-dashboard/lessons/lessons.component').then(
                (m) => m.LessonsComponent
              ),
          },
          {
            path: 'lessons-curriculums/:id',
            data: { title: 'CURRICULUMS' },
            loadComponent: () =>
              import('../teacher-dashboard/lessons-curriculums/lessons-curriculums.component').then(
                (m) => m.LessonsCurriculumsComponent
              ),
          },
          {
            path: 'single-skill/:domainId/:curriculumId',
            loadComponent: () =>
              import(
                '../teacher-dashboard/single-skill/single-skill.component'
              ).then((m) => m.SingleSkillComponent),
          },
          {
            path: 'leveled-reading',
            data: { title: 'MENU.LEVELED_READING' },
            loadComponent: () =>
              import(
                '../teacher-dashboard/leveled-reading/leveled-reading.component'
              ).then((m) => m.LeveledReadingComponent),
          },
          {
            path: 'student-level',
            data: { title: 'MENU.STUDENT_LEVEL' },
            loadComponent: () =>
              import(
                '../teacher-dashboard/student-level/student-level.component'
              ).then((m) => m.StudentLevelComponent),
          },
          {
            path: 'reading-criteria',
            data: { title: 'MENU.READING_CRITERIA' },
            loadComponent: () =>
              import(
                '../teacher-dashboard/reading-criteria/reading-criteria.component'
              ).then((m) => m.ReadingCriteriaComponent),
          },
          {
            path: 'book-details',
            data: { title: 'MENU.BOOK_DETAILS' },
            loadComponent: () =>
              import(
                '../teacher-dashboard/leveled-reading/book-details/book-details.component'
              ).then((m) => m.BookDetailsComponent),
          },
          {
            path: 'leveled-display',
            loadComponent: () =>
              import(
                '../teacher-dashboard/leveled-display/leveled-display.component'
              ).then((m) => m.LeveledDisplayComponent),
          },
          {
            path: 'questions',
            loadComponent: () =>
              import(
                '../teacher-dashboard/questions/questions.component'
              ).then((m) => m.QuestionsComponent),
          },
        ],
      },
];
