import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/authentication/login/login.component').then(
                (m) => m.LoginComponent
            ),
    },
    {
        path: 'features',
        loadChildren: () => import('./features/features.routes').then(m => m.Features_Routes)
    },
    {
        path: '**',
        loadComponent: () =>
            import('./shared/components/not-found/not-found.component').then(
                (m) => m.NotFoundComponent
            ),
    },
];
