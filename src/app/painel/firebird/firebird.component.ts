import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotyfService } from '../../services/notyf.service';
import { invoke } from '@tauri-apps/api/tauri';

interface FirebirdConfig {
  ip: string;
  aliases: string;
  is_fiscal: boolean;
}

@Component({
  selector: 'app-firebird',
  templateUrl: './firebird.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
  styleUrls: ['./firebird.component.scss']
})
export class FirebirdComponent implements OnInit {
  firebirdConfig: FirebirdConfig[] = [];
  
  constructor(private notyf: NotyfService) {}
  
  ngOnInit() {
    this.loadConfigurations();
  }
  
  async loadConfigurations() {
    try {
      const configPath = './config.json'; // Ensure the configPath is provided
      const config = await invoke<{ firebird: FirebirdConfig[] }>('load_firebird_config', { configPath });
      
      if (!config.firebird) {
        throw new Error('Missing field `firebird` in the configuration');
      }
      
      this.firebirdConfig = config.firebird;
      this.notyf.success('Configurations loaded successfully');
    } catch (error) {
      console.error('Error loading configurations:', error);
      this.notyf.error('Failed to load configurations');
    }
  }
}