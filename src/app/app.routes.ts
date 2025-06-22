import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { painelRoutes } from './painel/painel.routes';

export const routes: Routes = [
    { path: 'home', component: HomeComponent },
    ...painelRoutes,
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];