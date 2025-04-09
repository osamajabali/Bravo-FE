import { Routes } from '@angular/router';
import { LeveledReadingComponent } from '../reading/leveled-reading/leveled-reading.component';

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
        redirectTo: 'semesters',
        pathMatch: 'full',
    },
      {
        path: 'skills',
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
        path: 'semesters/units/:semesterId',
        loadComponent: () =>
          import('../teacher-dashboard/units/units.component').then(
            (m) => m.UnitsComponent
          ),
      },
      {
        path: 'semesters/lessons/:id',
        loadComponent: () =>
          import('../teacher-dashboard/lessons/lessons.component').then(
            (m) => m.LessonsComponent
          ),
      },
      {
        path: 'semesters/lessons-curriculums/:id',
        loadComponent: () =>
          import(
            '../teacher-dashboard/lessons-curriculums/lessons-curriculums.component'
          ).then((m) => m.LessonsCurriculumsComponent),
      },
      {
        path: 'semesters/single-skill/:domainId/:curriculumId',
        loadComponent: () =>
          import(
            '../teacher-dashboard/single-skill/single-skill.component'
          ).then((m) => m.SingleSkillComponent),
      },
      {
        path: 'leveled-reading',
        component : LeveledReadingComponent,
        children: [
          {
            path: '', // Default path when you visit /leveled-reading
            loadComponent: () =>
              import('../reading/book-list-view/book-list-view.component').then((m) => m.BookListViewComponent),
          },
          {
            path: 'leveled-reading-view', // Path for leveled-reading-view
            loadComponent: () =>
              import('../reading/leveled-reading-view/leveled-reading-view.component').then((m) => m.LeveledReadingViewComponent),
          },
        ]
      },
      
      {
        path: 'leveled-reading/books-grid/:id',
        loadComponent: () =>
          import(
            '../reading/books-grid/books-grid.component'
          ).then((m) => m.BooksGridComponent),
      },
      {
        path: 'skills/skills-level-one/:domainId',
        loadComponent: () =>
          import(
            '../teacher-dashboard/skill-level-one/skill-level-one.component'
          ).then((m) => m.SkillLevelOneComponent),
      },
      {
        path: 'skills/skills-level-two/:domainId',
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
            '../reading/book-details/book-details.component'
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
          import('../teacher-dashboard/questions/questions.component').then(
            (m) => m.QuestionsComponent
          ),
      },
      {
        path: 'assignments',
        loadComponent: () =>
          import('../teacher-dashboard/assignments/assignments.component').then(
            (m) => m.AssignmentsComponent
          ),
      },
      {
        path: 'assignments/:id',
        loadComponent: () =>
          import('../teacher-dashboard/assignment-details/assignment-details.component').then(
            (m) => m.AssignmentDetailsComponent
          ),
      },
    ],
  },
];
