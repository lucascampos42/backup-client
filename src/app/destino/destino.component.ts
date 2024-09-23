import { Component, OnInit } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { open } from "@tauri-apps/api/dialog";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../services/notyf.service';
import { invoke } from '@tauri-apps/api/tauri';

interface DirectoryConfig {
  directory: string;
}

@Component({
  selector: 'app-destino',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.scss'
})
export class DestinoComponent implements OnInit {
  selectedDirectory: string | null = null;
  clientHash: string = '';
  clientCnpj: string = '';
  backupInterval: number = 1;
  backupDiurno: boolean = false;
  backupNoturno: boolean = false;
  backupSabado: boolean = false;
  backupDomingo: boolean = false;
  intervals: { value: number, label: string }[] = [
    { value: 1, label: 'Intervalos de 1h' },
    { value: 2, label: 'Intervalos de 2h' },
    { value: 3, label: 'Intervalos de 3h' },
    { value: 4, label: 'Intervalos de 4h' },
    { value: 5, label: 'Intervalos de 5h' },
    { value: 6, label: 'Intervalos de 6h' }
  ];

  constructor(private notyfService: NotyfService) {}

  ngOnInit() {
    this.loadBackupDirectory();
  }

  async selectDirectory() {
    const result = await open({
      directory: true,
      multiple: false
    });
    if (result) {
      this.selectedDirectory = result as string;
    }
  }

  async saveBackupDirectory() {
    if (!this.selectedDirectory) {
      this.notyfService.error('Nenhum diretório selecionado');
      return;
    }

    try {
      await invoke('save_backup_directory', { directory: this.selectedDirectory });
      this.notyfService.success('Diretório de backup salvo com sucesso!');
    } catch (error) {
      this.notyfService.error('Erro ao salvar diretório de backup: ' + error);
    }
  }

  async loadBackupDirectory() {
    try {
      const directory = await invoke<string>('load_backup_directory');
      this.selectedDirectory = directory;
    } catch (error) {
      console.error('Erro ao carregar diretório de backup:', error);
    }
  }

  saveSettings() {
    this.saveBackupDirectory();
    this.notyfService.success('Configurações salvas');
  }
}