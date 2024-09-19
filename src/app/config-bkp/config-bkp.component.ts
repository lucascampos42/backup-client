import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../services/config.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {LockButtonComponent} from "../shared/lock-button/lock-button.component";
import {MenuComponent} from "../shared/menu/menu.component";

@Component({
  selector: 'app-config-panel',
  templateUrl: './config-bkp.component.html',
  styleUrls: ['./config-bkp.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, LockButtonComponent, MenuComponent]
})
export class ConfigBkpComponent implements OnInit {
  firebirdConfigs: { ip: string, alias: string }[] = [];
  newIp: string = '';
  newAlias: string = '';

  constructor(private configService: ConfigService, private router: Router) {}

  ngOnInit(): void {
    this.configService.getFirebirdConfig().then(configs => {
      this.firebirdConfigs = configs;
      console.log(this.firebirdConfigs); // Adicionar log para verificar os dados
    }).catch(error => {
      console.error('Erro ao obter configurações:', error);
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