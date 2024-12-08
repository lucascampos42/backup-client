import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  currentRoute: string;

  constructor(private router: Router) {
    this.currentRoute = '';
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }
}