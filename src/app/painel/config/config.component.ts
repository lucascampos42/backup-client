import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {MatIcon} from "@angular/material/icon";

@Component({
    selector: 'app-config',
    templateUrl: './config.component.html',
    styleUrls: ['./config.component.scss'],
    imports: [
      FormsModule,
      MatIcon
    ]
})
export class ConfigComponent {}