import { Routes } from '@angular/router';

export const MainFeatures_Routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./layout/layout.component')
            .then(m => m.LayoutComponent) // Correctly lazy-loads the LoginComponent
    },
];
