import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  currentRoute: string = '';
  navLinks = [
    { path: '/painel/dashboard', label: 'Dashboard' },
    { path: '/painel/aliases', label: 'Aliases Firebird' },
    { path: '/painel/pasta', label: 'BKP de Diretorios' },
    { path: '/painel/destino', label: 'Destino' },
    { path: '/painel/config', label: 'Configuração' }
  ];
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }
}