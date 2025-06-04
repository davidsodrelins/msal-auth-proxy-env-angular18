import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { LoginFailedComponent } from './components/login-failed/login-failed.component';
import { FeatureSelectionComponent } from './pages/feature-selection/feature-selection.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    // canActivate: [MsalGuard, authGuard],
    runGuardsAndResolvers: "always",
    loadChildren: () => import('./pages/home/home.routes').then(m => m.HomeRoutingModule),
  },
  {
    path: 'feature-selection',
    component: FeatureSelectionComponent,
    // canActivate: [MsalGuard, authGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login-failed',
    component: LoginFailedComponent
  }
];
