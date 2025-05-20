import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup.page').then( m => m.SignupPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'password',
    loadComponent: () => import('./password/password.page').then( m => m.PasswordPage)
  },  {
    path: 'user-register',
    loadComponent: () => import('./user-register/user-register.page').then( m => m.UserRegisterPage)
  },
  {
    path: 'register-mr-doctor',
    loadComponent: () => import('./register-mr-doctor/register-mr-doctor.page').then( m => m.RegisterMrDoctorPage)
  },
  {
    path: 'search',
    loadComponent: () => import('./search/search.page').then( m => m.SearchPage)
  },
  {
    path: 'hacercita',
    loadComponent: () => import('./hacercita/hacercita.page').then( m => m.HacercitaPage)
  },
  {
    path: 'horarios',
    loadComponent: () => import('./horarios/horarios.page').then( m => m.HorariosPage)
  },

];
