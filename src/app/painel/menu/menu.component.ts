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
    { path: '/painel/firebird', label: 'Aliases Firebird' },
    { path: '/painel/origem', label: 'BKP origem' },
    { path: '/painel/destino', label: 'BKP destino' },
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