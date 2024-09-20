// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AliasesComponent } from './aliases/aliases.component';
import { LocaisComponent } from './locais/locais.component';
import { NuvemComponent } from './nuvem/nuvem.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import  { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'aliases', component: AliasesComponent },
    { path: 'local-destinations', component: LocaisComponent },
    { path: 'cloud-destinations', component: NuvemComponent },
    { path: 'reports', component: RelatoriosComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];