import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  imports: [
    FormsModule,
    MatIcon
  ]
})
export class ConfigComponent implements OnInit {
  
  ngOnInit() {
    document.getElementById('selectButton')?.addEventListener('click', () => {
      document.getElementById('fileInput')?.click();
    });
    
    document.getElementById('fileInput')?.addEventListener('change', (event: any) => {
      const filePath = event.target.files[0].path;
      (document.getElementById('gbakPath') as HTMLInputElement).value = filePath;
    });
  }
}