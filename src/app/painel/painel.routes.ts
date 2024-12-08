import { Routes } from '@angular/router';
import { PainelComponent } from './painel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {OrigemComponent} from "./origem/origem.component";
import {DestinoComponent} from "./destino/destino.component";
import {ConfigComponent} from "./config/config.component";

export const painelRoutes: Routes = [
  {
    path: 'painel',
    component: PainelComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'origem', component: OrigemComponent },
      { path: 'destino', component: DestinoComponent },
      { path: 'config', component: ConfigComponent }
    ]
  }
];