import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { invoke } from '@tauri-apps/api/tauri';

export interface Config {
  gbak_path: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private configUrl = 'http://localhost:1420/config';

  constructor(private http: HttpClient) {}

  async saveConfig(config: Config): Promise<void> {
    try {
      console.log('Calling save_config with config:', config); // Adiciona log para depuração
      await invoke('save_config', { config });
      console.log('Configuration saved successfully'); // Adiciona log para depuração
    } catch (error) {
      console.error('Failed to save config:', error); // Adiciona log para depuração
    }
  }

  async loadConfig(): Promise<Config | null> {
    try {
      console.log('Calling load_config'); // Adiciona log para depuração
      const config = await invoke<Config>('load_config');
      console.log('Configuration loaded successfully:', config); // Adiciona log para depuração
      return config;
    } catch (error) {
      console.error('Failed to load config:', error); // Adiciona log para depuração
      return null;
    }
  }
}