import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import { NotyfService } from '../../services/notyf.service';

interface DestinoConfig {
  path: string;
}

@Component({
  selector: 'app-destino',
  standalone: true,
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
      }
    } catch {
      this.notyfService.error('Seleção de pasta não suportada neste ambiente.');
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