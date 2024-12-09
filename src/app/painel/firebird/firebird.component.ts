import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../../services/notyf.service';
import { invoke } from '@tauri-apps/api/tauri';
import {MatIconModule} from "@angular/material/icon";

interface FirebirdConfig {
  ip: string;
  aliases: string;
  is_fiscal: boolean;
}

@Component({
  selector: 'app-firebird',
  templateUrl: './firebird.component.html',
  imports: [
    FormsModule,
    CommonModule,
    MatIconModule
  ],
  styleUrls: ['./firebird.component.scss']
})
export class FirebirdComponent implements OnInit {
  firebirdConfig: FirebirdConfig[] = [];
  newConnection: FirebirdConfig = { ip: '', aliases: '', is_fiscal: false };
  
  constructor(private notyf: NotyfService) {}
  
  ngOnInit() {
    this.loadConfigurations();
  }
  
  async loadConfigurations() {
    try {
      const configPath = './config.json'; // Ensure the configPath is provided
      const config = await invoke<{ firebird: FirebirdConfig[] }>('load_firebird_config', { configPath });
      
      if (!config.firebird) {
        throw new Error('Campo `firebird` ausente na configuração');
      }
      
      this.firebirdConfig = config.firebird;
      this.notyf.success('Configurações carregadas com sucesso');
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      this.notyf.error('Falha ao carregar configurações');
    }
  }
  
  async addFirebirdConnection() {
    try {
      const configPath = './config.json'; // Ensure the configPath is provided
      await invoke('add_firebird_connection', { configPath, newConnection: this.newConnection });
      this.firebirdConfig.push({ ...this.newConnection });
      this.newConnection = { ip: '', aliases: '', is_fiscal: false };
      this.notyf.success('Nova conexão adicionada com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar nova conexão:', error);
      this.notyf.error('Falha ao adicionar nova conexão');
    }
  }
}