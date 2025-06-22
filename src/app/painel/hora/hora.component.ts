import { Component, OnInit } from '@angular/core';
      import { CommonModule } from '@angular/common';
      import { FormsModule } from '@angular/forms';
      import { invoke } from '@tauri-apps/api/tauri';
      import { NotyfService } from '../../services/notyf.service';

      @Component({
    selector: 'app-hora',
    imports: [CommonModule, FormsModule],
    templateUrl: './hora.component.html',
    styleUrls: ['./hora.component.scss']
})
      export class HoraComponent implements OnInit {
        horarios: string[] = [];
        novoHorario = '';

        constructor(private notyfService: NotyfService) {}

        async ngOnInit() {
          await this.loadHorarios();
        }

        private async loadHorarios() {
          try {
            const result = await invoke<string[]>('load_backup_schedule_hours');
            this.horarios = Array.isArray(result) ? result : [];
          } catch {
            this.notyfService.error('Erro ao carregar horários de backup.');
            this.horarios = [];
          }
        }

        async addHorario() {
          try {
            await invoke('add_backup_schedule_hour', { horario: this.novoHorario });
            this.notyfService.success('Horário adicionado.');
            this.novoHorario = '';
            await this.loadHorarios();
          } catch {
            this.notyfService.error('Erro ao adicionar horário.');
          }
        }

        async removeHorario(index: number) {
          try {
            await invoke('remove_backup_schedule_hour', { index });
            this.notyfService.success('Horário removido.');
            this.horarios.splice(index, 1);
          } catch {
            this.notyfService.error('Erro ao remover horário.');
          }
        }
      }