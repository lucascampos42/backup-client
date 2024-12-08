import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss'],
    imports: [
        FormsModule,
    ]
})
export class ConfigComponent {
  gbakPath: string = '';
  username: string = '';
  password: string = '';

  async selectGbakPath() {
    try {
      const selectedPath = await open({
        directory: false,
        multiple: false,
        filters: [{ name: 'Executáveis', extensions: ['exe'] }]
      });
      if (selectedPath) {
        this.gbakPath = selectedPath as string;
      }
    } catch (error) {
      console.error('Falha ao selecionar o caminho do GBAK:', error);
    }
  }

  async saveBackupConfig() {
    const config = {
      gbak_path: this.gbakPath,
      username: this.username,
      password: this.password,
    };

    try {
      await invoke('save_backup_config', { backupConfig: config });
      alert('Configuração de backup salva com sucesso!');
    } catch (error) {
      console.error('Falha ao salvar a configuração de backup:', error);
      alert('Falha ao salvar a configuração de backup.');
    }
  }
}