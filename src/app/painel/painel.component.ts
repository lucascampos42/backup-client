import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';

@Component({
  selector: 'app-painel',
  imports: [RouterModule, MenuComponent],
  template: `
      <app-menu />
  `
})
export class PainelComponent {
  currentRoute: string;
  
  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }
}