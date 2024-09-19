// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ConfigPanelComponent } from './config-panel/config-panel.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'config-panel', component: ConfigPanelComponent },
];