import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { invoke } from '@tauri-apps/api/tauri';
import { NotyfService } from '../../services/notyf.service';

interface AliasConfig {
  ip: string;
  alias: string;
  is_fiscal: boolean;
}

@Component({
  selector: 'app-aliases',
  templateUrl: './aliases.component.html',
  imports: [
    FormsModule,
    CommonModule,
  ],
  styleUrls: ['./aliases.component.scss']
})
export class AliasesComponent implements OnInit {
  aliasesConfig: AliasConfig[] = [];
  newIp: string = '';
  newAlias: string = '';
  newIsFiscal: boolean = false;
  
  constructor(private router: Router, private notyfService: NotyfService) {}
  
  ngOnInit() {
    this.loadAliases();
  }
  
  addAlias() {
    if (this.newIp && this.newAlias) {
      this.aliasesConfig.push({ ip: this.newIp, alias: this.newAlias, is_fiscal: this.newIsFiscal });
      this.newIp = '';
      this.newAlias = '';
      this.newIsFiscal = false;
    }
  }
  
  removeAlias(index: number) {
    this.aliasesConfig.splice(index, 1);
  }
  
  async saveAliases() {
    try {
      const config = await invoke<{ aliases: AliasConfig[] }>('load_config');
      config.aliases = this.aliasesConfig;
      console.log('Saving aliases:', config.aliases); // Debug log
      await invoke('save_config', { config });
      this.notyfService.success('Aliases salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar aliases:', error); // Debug log
      this.notyfService.error('Erro ao salvar aliases:');
    }
  }
  
  async loadAliases() {
    try {
      const aliases = await invoke<AliasConfig[]>('load_aliases');
      this.aliasesConfig = aliases;
    } catch (error) {
      this.handleLoadError(error, 'aliases');
    }
  }
  
  handleLoadError(error: any, type: string) {
    if (error === 'File not found') {
      console.error(`Arquivo de configuração não encontrado. Nenhum ${type} carregado.`);
    } else {
      console.error(`Erro ao carregar ${type}:`, error);
    }
  }
  
  saveConfigurations() {
  
  }
}