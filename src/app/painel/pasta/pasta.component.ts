import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { NotyfService } from '../../services/notyf.service';

interface DirectoryConfig {
    directory: string;
}

interface Config {
    directories: DirectoryConfig[];
}

@Component({
    selector: 'app-aliases',
    templateUrl: './pasta.component.html',
    imports: [
        FormsModule,
        CommonModule,
    ],
    styleUrls: ['./pasta.component.scss']
})
export class PastaComponent implements OnInit {
    directoriesConfig: DirectoryConfig[] = [];
    selectedDirectory: string | null = null;
    
    constructor(private router: Router, private notyfService: NotyfService) {}
    
    ngOnInit() {
        this.loadConfigurations();
    }
    
    async selectDirectory() {
        const result = await open({
            directory: true,
            multiple: false
        });
        if (result) {
            this.selectedDirectory = result as string;
            this.directoriesConfig.push({ directory: this.selectedDirectory });
        }
    }
    
    async saveConfigurations() {
        await this.saveDirectories();
        this.notyfService.success('Configurações salvas com sucesso!');
    }
    
    async saveDirectories() {
        try {
            const config = await invoke<Config>('load_config');
            config.directories = this.directoriesConfig;
            console.log('Saving directories:', config.directories); // Adiciona log para depuração
            await invoke('save_config', { config });
            this.notyfService.success('Diretórios salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar diretórios:', error); // Adiciona log para depuração
            this.notyfService.error('Erro ao salvar diretórios:');
        }
    }
    
    async loadDirectories() {
        try {
            const directories = await invoke<DirectoryConfig[]>('load_directories');
            this.directoriesConfig = directories;
        } catch (error) {
            this.handleLoadError(error, 'diretórios');
        }
    }
    
    async loadConfigurations() {
        await this.loadDirectories();
    }
    
    handleLoadError(error: any, type: string) {
        if (error === 'File not found') {
            console.error(`Arquivo de configuração não encontrado. Nenhum ${type} carregado.`);
        } else {
            console.error(`Erro ao carregar ${type}:`, error);
        }
    }
    
    removeDirectory(index: number): void {
        this.directoriesConfig.splice(index, 1);
    }
}