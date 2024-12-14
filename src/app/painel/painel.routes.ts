import { Routes } from '@angular/router';
import { PainelComponent } from './painel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {BkpdiretoriosComponent} from "./bkpdiretorios/bkpdiretorios.component";
import {ConfigComponent} from "./config/config.component";
import {FirebirdComponent} from "./firebird/firebird.component";

export const painelRoutes: Routes = [
  {
    path: 'painel',
    component: PainelComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'firebird', component: FirebirdComponent },
      { path: 'pasta', component: BkpdiretoriosComponent },
      { path: 'config', component: ConfigComponent },
    ]
  }
];