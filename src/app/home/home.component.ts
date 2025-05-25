import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotyfService } from '../services/notyf.service';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true
})
export class HomeComponent implements OnInit {
  private attemptCount = 0;

  constructor(private router: Router, private notyfService: NotyfService) {}
  
  ngOnInit() {
    listen('backup-progress', (event) => {
      this.notyfService.success(event.payload as string);
    });
    
    listen('backup-now', () => {
      this.backupNow();
    });
  }
  
  accessPanel(event: SubmitEvent, password: string): void {
    event.preventDefault();
    
    invoke<boolean>('validate_password', { password })
      .then(isValid => {
        if (isValid) {
          this.notyfService.success('Acesso concedido. Redirecionando...');
          setTimeout(() => {
            this.router.navigate(['/painel']);
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
      await invoke('backup_firebird_databases');
      this.notyfService.success('Backup realizado com sucesso!');
    } catch (error) {
      this.notyfService.error('Erro ao realizar backup: ' + error);
    }
  }
}