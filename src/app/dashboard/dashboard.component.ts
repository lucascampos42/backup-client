// src/app/dashboard/dashboard.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [MenuComponent]
})
export class DashboardComponent {
  constructor(private router: Router) {}

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}