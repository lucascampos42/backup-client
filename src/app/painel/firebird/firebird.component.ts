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
      const config = await invoke<{ firebird: FirebirdConfig[] }>('load_firebird_config');
      
      if (!config.firebird) {
        throw new Error('Campo `firebird` ausente na configuração');
      }
      
      this.firebirdConfig = config.firebird;
      this.notyf.success('Configurações carregadas com sucesso');
    } catch (error) {
      this.notyf.error('Falha ao carregar configurações');
    }
  }
  
  async addFirebirdConnection() {
    try {
      await invoke('add_firebird_connection', { newConnection: this.newConnection });
      this.firebirdConfig.push({ ...this.newConnection });
      this.newConnection = { ip: '', aliases: '', is_fiscal: false };
      this.notyf.success('Nova conexão adicionada com sucesso');
    } catch (error) {
      if (error === 'Conexão com o mesmo IP e aliases já existe.') {
        this.notyf.error('Conexão com o mesmo IP e aliases já existe.');
      } else {
        this.notyf.error('Falha ao adicionar nova conexão');
      }
    }
  }
  
  deleteFirebirdConnection(ip: string, aliases: string) {
    console.log(`Deleting connection with IP: ${ip}, Aliases: ${aliases}`);
    
    invoke('delete_firebird_connection', { ip, aliases })
      .then(() => {
        this.firebirdConfig = this.firebirdConfig.filter(config => config.ip !== ip || config.aliases !== aliases);
      })
      .catch(err => {
        console.error('Erro ao deletar a conexão:', err);
      });
  }
}