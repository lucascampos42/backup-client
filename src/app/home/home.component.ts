// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NotyfService } from '../services/notyf.service';
import { invoke } from '@tauri-apps/api/tauri';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true
})
export class HomeComponent {
  accessMessage = "";
  private attemptCount = 0;

  constructor(private router: Router, private notyfService: NotyfService) {}
  
  accessPanel(event: SubmitEvent, password: string): void {
    event.preventDefault();
    
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Months are zero-based
    const year = currentDate.getFullYear();
    
    invoke<boolean>('validate_password', { password, day, month, year })
      .then(isValid => {
        if (isValid) {
          this.notyfService.success('Acesso concedido. Redirecionando...');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 500);
        } else {
          this.attemptCount++;
          if (this.attemptCount >= 2) {
            this.notyfService.error('Painel só pode ser usado por técnicos.');
          } else {
            this.notyfService.error('Senha incorreta. Tente novamente.');
          }
        }
      })
      .catch(error => {
        this.notyfService.error('Erro ao validar senha: ' + error);
      });
  }
  async backupNow() {
    try {
      await invoke('backup_now');
      this.notyfService.success('Backup realizado com sucesso!');
    } catch (error) {
      this.notyfService.error('Erro ao realizar backup: ' + error);
    }
  }
}