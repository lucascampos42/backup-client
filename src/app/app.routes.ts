// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AliasesComponent } from './aliases/aliases.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import  { HomeComponent } from './home/home.component';
import {DestinoComponent} from "./destino/destino.component";

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'aliases', component: AliasesComponent },
    { path: 'destino', component: DestinoComponent },
    { path: 'reports', component: RelatoriosComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];