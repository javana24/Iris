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
    path: 'auth',
    loadComponent: () =>
      import('./pages/auth-page/auth-page.component').then(
        (m) => m.AuthPageComponent
      )
  },
  {
    path: 'legal',
    loadComponent: () =>
      import('./pages/legal-page/legal-page.component').then(
        (m) => m.LegalPageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];
