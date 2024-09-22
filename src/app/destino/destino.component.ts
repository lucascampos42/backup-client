import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { open } from "@tauri-apps/api/dialog";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../services/notyf.service';

interface DirectoryConfig {
  directory: string;
}

@Component({
  selector: 'app-destino',
  standalone: true,
  imports: [
    MenuComponent,
    FormsModule,
    CommonModule
  ],
  templateUrl: './destino.component.html',
  styleUrl: './destino.component.scss'
})
export class DestinoComponent {
  directoriesConfig: DirectoryConfig[] = [];
  selectedDirectory: string | null = null;
  clientHash: string = '';
  clientCnpj: string = '';
  backupInterval: number = 1;
  backupDiurno: boolean = false;
  backupNoturno: boolean = false;
  backupSabado: boolean = false;
  backupDomingo: boolean = false;
  intervals: { value: number, label: string }[] = [
    { value: 1, label: 'Intervalos de 1h' },
    { value: 2, label: 'Intervalos de 2h' },
    { value: 3, label: 'Intervalos de 3h' },
    { value: 4, label: 'Intervalos de 4h' },
    { value: 5, label: 'Intervalos de 5h' },
    { value: 6, label: 'Intervalos de 6h' }
  ];

  constructor(private notyfService: NotyfService) {}

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

  saveSettings() {
    this.notyfService.success('Configurações salvas');
  }
}