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
            loadComponent: () =>
              import('../teacher-dashboard/stats/stats.component').then(
                (m) => m.StatsComponent
              ),
          },
          {
            path: 'semesters',
            loadComponent: () =>
              import('../teacher-dashboard/semesters/semesters.component').then(
                (m) => m.SemestersComponent
              ),
          },
          {
            path: 'units/:semesterId',
            loadComponent: () =>
              import('../teacher-dashboard/units/units.component').then(
                (m) => m.UnitsComponent
              ),
          },
          {
            path: 'lessons/:id',
            loadComponent: () =>
              import('../teacher-dashboard/lessons/lessons.component').then(
                (m) => m.LessonsComponent
              ),
          },
          {
            path: 'lessons-curriculums/:id',
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
            loadComponent: () =>
              import(
                '../teacher-dashboard/leveled-reading/leveled-reading.component'
              ).then((m) => m.LeveledReadingComponent),
          },
          {
            path: 'leveled-reading/books-grid',
            loadComponent: () =>
              import(
                '../teacher-dashboard/leveled-reading/books-grid/books-grid.component'
              ).then((m) => m.BooksGridComponent),
          },
          {
            path: 'skills-level-one/:domainId',
            loadComponent: () =>
              import(
                '../teacher-dashboard/skill-level-one/skill-level-one.component'
              ).then((m) => m.SkillLevelOneComponent),
          },
          {
            path: 'skills-level-two/:domainId',
            loadComponent: () =>
              import(
                '../teacher-dashboard/skill-level-two/skill-level-two.component'
              ).then((m) => m.SkillLevelTwoComponent),
          },
          {
            path: 'student-level',
            loadComponent: () =>
              import(
                '../teacher-dashboard/student-level/student-level.component'
              ).then((m) => m.StudentLevelComponent),
          },
          {
            path: 'reading-criteria',
            loadComponent: () =>
              import(
                '../teacher-dashboard/reading-criteria/reading-criteria.component'
              ).then((m) => m.ReadingCriteriaComponent),
          },
          {
            path: 'book-details',
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
