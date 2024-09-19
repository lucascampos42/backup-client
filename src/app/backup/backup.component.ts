import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {MenuComponent} from "../menu/menu.component";

interface FirebirdConfig {
    ip: string;
    alias: string;
}

@Component({
    selector: 'app-backup',
    templateUrl: './backup.component.html',
    standalone: true,
    imports: [
        FormsModule,
        MenuComponent
    ],
    styleUrls: ['./backup.component.scss']
})
export class BackupComponent {
    firebirdConfigs: FirebirdConfig[] = [];
    newIp: string = '';
    newAlias: string = '';
    newFolder: string = '';

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


}