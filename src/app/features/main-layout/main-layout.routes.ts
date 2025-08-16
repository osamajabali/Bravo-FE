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
        redirectTo: 'quick-actions',
        pathMatch: 'full',
      },
      {
        path: 'quick-actions',
        loadComponent: () =>
          import(
            '../teacher-dashboard/quick-actions/quick-actions.component'
          ).then((m) => m.QuickActionsComponent),
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
        path: 'semesters/units',
        loadComponent: () =>
          import('../teacher-dashboard/units/units.component').then(
            (m) => m.UnitsComponent
          ),
      },
      {
        path: 'semesters/lessons',
        loadComponent: () =>
          import('../teacher-dashboard/lessons/lessons.component').then(
            (m) => m.LessonsComponent
          ),
      },
      {
        path: 'semesters/lessons-curriculums',
        loadComponent: () =>
          import(
            '../teacher-dashboard/lessons-curriculums/lessons-curriculums.component'
          ).then((m) => m.LessonsCurriculumsComponent),
      },
      {
        path: 'semesters/single-skill',
        loadComponent: () =>
          import(
            '../teacher-dashboard/single-skill/single-skill.component'
          ).then((m) => m.SingleSkillComponent),
      },
      {
        path: 'leveled-reading',
        component: LeveledReadingComponent,
        children: [
          {
            path: '', // Default path when you visit /leveled-reading
            loadComponent: () =>
              import('../reading/book-list-view/book-list-view.component').then(
                (m) => m.BookListViewComponent
              ),
          },
          {
            path: 'leveled-reading-view', // Path for leveled-reading-view
            loadComponent: () =>
              import(
                '../reading/leveled-reading-view/leveled-reading-view.component'
              ).then((m) => m.LeveledReadingViewComponent),
          },
        ],
      },

      {
        path: 'leveled-reading/books-grid',
        loadComponent: () =>
          import('../reading/books-grid/books-grid.component').then(
            (m) => m.BooksGridComponent
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
        path: 'assignments/new',
        loadComponent: () =>
          import(
            '../teacher-dashboard/new-assignment/new-assignment.component'
          ).then((m) => m.NewAssignmentComponent),
      },
      {
        path: 'skills/skills-level-one',
        loadComponent: () =>
          import(
            '../teacher-dashboard/skill-level-one/skill-level-one.component'
          ).then((m) => m.SkillLevelOneComponent),
      },
      {
        path: 'skills/skills-level-two',
        loadComponent: () =>
          import(
            '../teacher-dashboard/skill-level-two/skill-level-two.component'
          ).then((m) => m.SkillLevelTwoComponent),
      },
      {
        path: 'skills/skills-level-three',
        loadComponent: () =>
          import(
            '../teacher-dashboard/skill-level-three/skill-level-three.component'
          ).then((m) => m.SkillLevelThreeComponent),
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
          import('../reading/book-details/book-details.component').then(
            (m) => m.BookDetailsComponent
          ),
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
        path: 'group',
        loadComponent: () =>
          import('../teacher-dashboard/group-details/group-details.component').then(
            (m) => m.GroupDetailsComponent
          ),
      },
      {
        path: 'assignmentsDetails',
        loadComponent: () =>
          import(
            '../teacher-dashboard/assignment-details/assignment-details.component'
          ).then((m) => m.AssignmentDetailsComponent),
      },
      {
        path: 'assignments/assignment-submission',
        loadComponent: () =>
          import(
            '../teacher-dashboard/assignment-submission/assignment-submission.component'
          ).then((m) => m.AssignmentSubmissionComponent),
      },
      {
        path: 'students',
        loadComponent: () =>
          import('../teacher-dashboard/students/students.component').then(
            (m) => m.StudentsComponent
          ),
      },
      {
        path: 'students/groups/:id',
        loadComponent: () =>
          import(
            '../teacher-dashboard/group-details/group-details.component'
          ).then((m) => m.GroupDetailsComponent),
      },
      {
        path: 'learner-profile/:id',
        loadComponent: () =>
          import(
            '../teacher-dashboard/learner-profile/learner-profile.component'
          ).then((m) => m.LearnerProfileComponent),
      },
    ],
  },
];
