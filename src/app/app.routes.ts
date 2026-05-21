import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/landing-page/landing-page.component').then(
        (m) => m.LandingPageComponent
      )
  },
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/profile-page/profile-page.component').then(
        (m) => m.ProfilePageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
