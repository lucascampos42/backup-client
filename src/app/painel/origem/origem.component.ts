import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {open} from '@tauri-apps/api/dialog';
import {invoke} from '@tauri-apps/api/tauri';
import {NotyfService} from '../../services/notyf.service';

interface DirectoryConfig {
  path: string;
}

@Component({
  selector: 'app-aliases',
  templateUrl: './origem.component.html',
  imports: [
    FormsModule,
    CommonModule,
  ],
  styleUrls: ['./origem.component.scss']
})
export class OrigemComponent implements OnInit {
  directoriesConfig: DirectoryConfig[] = [];

  constructor(private router: Router, private notyfService: NotyfService) {
  }

  ngOnInit() {
    this.loadDirectories();
  }

  async selectDirectory() {
    const result = await open({
      directory: true,
      multiple: false
    });
    if (result) {
      this.directoriesConfig.push({ path: result as string });
    }
  }

  async saveDirectories() {
    try {
      await invoke('save_directories', { directories: this.directoriesConfig });
      this.notyfService.success('Diretórios salvos com sucesso!');
    } catch (error) {
      this.notyfService.error('Erro ao salvar diretórios');
    }
  }

  async loadDirectories() {
    try {
      this.directoriesConfig = await invoke<DirectoryConfig[]>('load_directories');
    } catch (error) {
      this.notyfService.error('Erro ao carregar diretórios');
    }
  }

  async removeDirectory(index: number) {
    try {
      await invoke('remove_directory', { index });
      await this.loadDirectories();
      this.notyfService.success('Diretório removido!');
    } catch (error) {
      this.notyfService.error('Erro ao remover diretório');
    }
  }
}