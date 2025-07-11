import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { NotyfService } from '../../services/notyf.service';

interface DestinoConfig {
  path: string;
}

@Component({
    selector: 'app-destino',
    imports: [NgForOf],
    templateUrl: './destino.component.html',
    styleUrl: './destino.component.scss'
})
export class DestinoComponent implements OnInit {
  destinos: DestinoConfig[] = [];

  constructor(private notyfService: NotyfService) {}

  async ngOnInit() {
    await this.loadDestinos();
  }

  async loadDestinos() {
    try {
      const result = await invoke<string[]>('load_destinos');
      this.destinos = Array.isArray(result) ? result.map(path => ({ path })) : [];
    } catch (e) {
      this.destinos = [];
      this.notyfService.error('Erro ao carregar destinos');
    }
  }

  async addDestino() {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Selecione a pasta de destino'
      });

      const path = Array.isArray(selected) ? selected[0] : selected;

      if (path && !this.destinos.some(d => d.path === path)) {
        this.destinos.push({ path });
        await invoke('open_in_explorer', { path });
      }
    } catch (error) {
      console.error('Erro real no open():', error);
      this.notyfService.error(
        error instanceof Error ? error.message : 'Erro desconhecido ao selecionar pasta.'
      );
    }
  }


  removeDestino(index: number) {
    this.destinos.splice(index, 1);
  }

  async saveDestinos() {
    try {
      await invoke('save_destinos', { destinos: this.destinos.map(d => d.path) });
      this.notyfService.success('Destinos salvos!');
    } catch (e) {
      this.notyfService.error('Erro ao salvar destinos');
    }
  }
}