// src/app/aliases/aliases.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';
import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { NotyfService } from '../services/notyf.service';

interface AliasConfig {
    ip: string;
    alias: string;
    is_fiscal: boolean;
}

interface DirectoryConfig {
    directory: string;
}

interface Config {
    aliases: AliasConfig[];
    directories: DirectoryConfig[];
}

@Component({
    selector: 'app-aliases',
    templateUrl: './origem.component.html',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MenuComponent
    ],
    styleUrls: ['./origem.component.scss']
})
export class OrigemComponent implements OnInit {
    aliasesConfig: AliasConfig[] = [];
    directoriesConfig: DirectoryConfig[] = [];
    newIp: string = '';
    newAlias: string = '';
    newIsFiscal: boolean = false;
    selectedDirectory: string | null = null;

    constructor(private router: Router, private notyfService: NotyfService) {}

    ngOnInit() {
        this.loadConfigurations();
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
        await this.saveAliases();
        await this.saveDirectories();
        this.notyfService.success('Configurações salvas com sucesso!');
    }

    async saveAliases() {
        try {
            const config = await invoke<Config>('load_config');
            config.aliases = this.aliasesConfig;
            console.log('Saving aliases:', config.aliases); // Adiciona log para depuração
            await invoke('save_config', { config });
            this.notyfService.success('Aliases salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar aliases:', error); // Adiciona log para depuração
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
        await this.loadAliases();
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