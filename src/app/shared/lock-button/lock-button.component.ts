// src/app/shared/lock-button/lock-button.component.ts
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lock-button',
  template: `<button class="lock-icon" (click)="navigate()">🔒</button>`,
  styleUrls: ['./lock-button.component.scss'],
  standalone: true
})
export class LockButtonComponent {
  @Input() route: string = '/';

  constructor(private router: Router) {}

  navigate() {
    this.router.navigate([this.route]);
  }
}