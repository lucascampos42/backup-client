import { Component, OnInit } from '@angular/core';
import { ConfigService, Config } from '../services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
<<<<<<< HEAD:src/app/config-bkp/config-bkp.component.ts
  selector: 'app-config-bkp',
  templateUrl: './config-bkp.component.html',
  standalone: true,
  styleUrls: ['./config-bkp.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule]
})
export class ConfigBkpComponent implements OnInit {
  configForm: FormGroup;
  firebirdConfigs: { ip: string; alias: string; }[] = [];
  newIp: string = '';
  newAlias: string = '';

  constructor(private configService: ConfigService, private fb: FormBuilder) {
    this.configForm = this.fb.group({
      gbak_path: ['']
=======
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
>>>>>>> parent of 6cf79b5 (aliases):src/app/config-panel/config-panel.component.ts
    });
  }

  ngOnInit(): void {
    this.configService.getFirebirdConfig().subscribe(configs => {
      this.firebirdConfigs = configs.firebirdConfigs;
    }, error => {
      console.error(error);
    });
  }

  addConfig(): void {
    if (this.newIp && this.newAlias) {
      this.firebirdConfigs.push({ ip: this.newIp, alias: this.newAlias });
      this.newIp = '';
      this.newAlias = '';
    }
  }

  removeConfig(index: number): void {
    this.firebirdConfigs.splice(index, 1);
  }

  saveConfig(): void {
    const config: Config = this.configForm.value;
    this.configService.saveConfig(config).subscribe(() => {
      console.log('Configuração salva com sucesso');
    }, error => {
      console.error(error);
    });
  }
}