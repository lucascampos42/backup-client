// src/app/aliases/aliases.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from '../menu/menu.component';
import { open } from '@tauri-apps/api/dialog';

interface FirebirdConfig {
    ip: string;
    alias: string;
}

@Component({
    selector: 'app-aliases',
    templateUrl: './aliases.component.html',
    standalone: true,
    imports: [
        FormsModule,
        MenuComponent
    ],
    styleUrls: ['./aliases.component.scss']
})
export class AliasesComponent {
    firebirdConfigs: FirebirdConfig[] = [];
    newIp: string = '';
    newAlias: string = '';
    selectedDirectory: string | null = null;

    addConfig() {
        if (this.newIp && this.newAlias) {
            this.firebirdConfigs.push({ ip: this.newIp, alias: this.newAlias });
            this.newIp = '';
            this.newAlias = '';
        }
    }

    removeConfig(index: number) {
        this.firebirdConfigs.splice(index, 1);
    }

    async selectDirectory() {
        const result = await open({
            directory: true,
            multiple: false
        });
        if (result) {
            this.selectedDirectory = result as string;
        }
    }
}