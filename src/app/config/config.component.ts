import { Component, OnInit } from '@angular/core';
import { ConfigService, Config } from '../services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  standalone: true,
  styleUrls: ['./config.component.css'],
  imports: [ReactiveFormsModule, HttpClientModule]
})
export class ConfigComponent implements OnInit {
  configForm: FormGroup;

  constructor(private configService: ConfigService, private fb: FormBuilder) {
    this.configForm = this.fb.group({
      gbak_path: ['']
    });
  }

  ngOnInit(): void {
    this.configService.getConfig().subscribe((config: Config) => {
      this.configForm.patchValue(config);
    });
  }

  saveConfig(): void {
    const config: Config = this.configForm.value;
    this.configService.saveConfig(config).subscribe(() => {
      console.log('Configuração salva com sucesso');
    });
  }
}