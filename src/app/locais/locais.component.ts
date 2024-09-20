import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-locais',
  standalone: true,
    imports: [
        MenuComponent
    ],
  templateUrl: './locais.component.html',
  styleUrl: './locais.component.css'
})
export class LocaisComponent {

}
