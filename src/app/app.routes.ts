import { Routes } from '@angular/router';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { HomeComponent } from './home/home.component';
import { painelRoutes } from './painel/painel.routes';

export const routes: Routes = [
    { path: 'reports', component: RelatoriosComponent },
    { path: 'home', component: HomeComponent },
    ...painelRoutes,
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];