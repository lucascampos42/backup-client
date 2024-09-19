import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-panel.component.html',
  styleUrls: ['./config-panel.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class ConfigPanelComponent implements OnInit {
  firebirdConfigs: { ip: string, alias: string }[] = [];
  newIp: string = '';
  newAlias: string = '';

  constructor(private configService: ConfigService, private router: Router) {}

  ngOnInit(): void {
    this.configService.getFirebirdConfig().then(configs => {
      this.firebirdConfigs = configs;
      console.log(this.firebirdConfigs); // Adicionar log para verificar os dados
    }).catch(error => {
      console.error('Erro ao obter configurações:', error); // Adicionar log de erro
    });
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  removeConfig(index: number): void {
    this.firebirdConfigs.splice(index, 1);
  }

  addConfig(): void {
    if (this.newIp && this.newAlias) {
      this.firebirdConfigs.push({ ip: this.newIp, alias: this.newAlias });
      this.newIp = '';
      this.newAlias = '';
    }
  }
}