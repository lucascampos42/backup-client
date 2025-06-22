import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { NotyfService } from '../../services/notyf.service';

interface BackupGbakConfig {
  gbak_path: string;
  username: string;
  password: string;
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  imports: [
    FormsModule,
    MatIcon
  ]
})
export class ConfigComponent implements OnInit {
  gbakPath: string = '';
  username: string = '';
  password: string = '';

  constructor(private notyf: NotyfService) {}

  ngOnInit() {
    this.loadBackupGbakConfig();
  }

  async loadBackupGbakConfig() {
    try {
      const config = await invoke<BackupGbakConfig>('load_backup_gbak_config');
      console.log('Loaded config:', config);
      this.gbakPath = config.gbak_path;
      this.username = config.username;
      this.password = config.password;
      this.notyf.success('Configuração carregada com sucesso');
    } catch (error) {
      console.error('Failed to load backup GBAK config:', error);
      this.notyf.error('Falha ao carregar a configuração');
    }
  }

  async saveConfig() {
    const newConfig: BackupGbakConfig = {
      gbak_path: this.gbakPath,
      username: this.username,
      password: this.password
    };

    try {
      await invoke('update_backup_gbak_config', { newConfig });
      this.notyf.success('Configuração salva com sucesso');
    } catch (error) {
      console.error('Failed to save backup GBAK config:', error);
      this.notyf.error('Falha ao salvar a configuração');
    }
  }
  
  async onFileSelected() {
    try {
      const selectedPath = await open({
        filters: [{ name: 'Executables', extensions: ['exe'] }],
        multiple: false,
      });
      
      if (selectedPath) {
        console.log('Selected path:', selectedPath);
        this.gbakPath = selectedPath as string;
      } else {
        this.notyf.error('Nenhum arquivo selecionado');
      }
    } catch (error) {
      console.error('Error selecting file:', error);
      this.notyf.error('Erro ao selecionar o arquivo');
    }
  }
}