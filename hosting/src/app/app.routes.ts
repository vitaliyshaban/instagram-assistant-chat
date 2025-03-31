import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ConfigComponent } from './dashboard/instagram/config/config.component';
import { IceBreakersComponent } from './dashboard/instagram/ice-breakers/ice-breakers.component';
import { BaseTemplatesComponent } from './dashboard/instagram/base-templates/base-templates.component';
// import { ProductTemplatesComponent } from './dashboard/instagram/product-templates/product-templates.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],  // Защищаем маршрут
    children: [
      {
        path: 'base-templates',
        component: BaseTemplatesComponent,
      },
      // {
      //   path: 'product-templates',
      //   component: ProductTemplatesComponent,
      // },
      {
        path: 'ice-breakers',
        component: IceBreakersComponent,
      },
      {
        path: 'config',
        component: ConfigComponent,
      },
      
    ],
  },
  { path: '**', redirectTo: 'login' }
];
