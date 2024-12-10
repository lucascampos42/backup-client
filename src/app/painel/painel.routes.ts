import { Routes } from '@angular/router';
import { PainelComponent } from './painel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {PastaComponent} from "./pasta/pasta.component";
import {DestinoComponent} from "./destino/destino.component";
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
      { path: 'pasta', component: PastaComponent },
      { path: 'destino', component: DestinoComponent },
      { path: 'config', component: ConfigComponent },
    ]
  }
];