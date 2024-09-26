// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrigemComponent } from './origem/origem.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import  { HomeComponent } from './home/home.component';
import {DestinoComponent} from "./destino/destino.component";
import {ConfigComponent} from "./config/config.component";

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'origem', component: OrigemComponent },
    { path: 'destino', component: DestinoComponent },
    { path: 'reports', component: RelatoriosComponent },
    { path: 'home', component: HomeComponent },
    { path: 'config', component: ConfigComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];