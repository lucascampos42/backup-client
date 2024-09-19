// src/app/shared/menu/menu.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {LockButtonComponent} from "../lock-button/lock-button.component";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  imports: [
    LockButtonComponent
  ],
  standalone: true
})
export class MenuComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}