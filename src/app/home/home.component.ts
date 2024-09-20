// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true
})
export class HomeComponent {
  accessMessage = "";
  private attemptCount = 0;

  constructor(private router: Router) {}

  accessPanel(event: SubmitEvent, password: string): void {
    event.preventDefault();

    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const year = currentDate.getFullYear();

    const calculatedPassword = 30676 * day * month + year;

    if (password === calculatedPassword.toString()) {
      this.accessMessage = 'Acesso concedido. Redirecionando...';
      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1500); // Atraso de 2 segundos
    } else {
      this.attemptCount++;
      if (this.attemptCount >= 2) {
        this.accessMessage = "Painel só pode ser usado por técnicos.";
      } else {
        this.accessMessage = "Senha incorreta. Tente novamente.";
      }
    }
  }
}