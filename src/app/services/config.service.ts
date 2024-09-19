import { Injectable } from '@angular/core';
import { invoke } from '@tauri-apps/api/tauri';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  async getFirebirdConfig(): Promise<{ ip: string, alias: string }[]> {
    return await invoke('get_firebird_config');
  }
}