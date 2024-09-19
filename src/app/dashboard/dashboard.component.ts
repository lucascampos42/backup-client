// src/app/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LockButtonComponent } from '../shared/lock-button/lock-button.component';
import {MenuComponent} from "../shared/menu/menu.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [LockButtonComponent, MenuComponent],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}