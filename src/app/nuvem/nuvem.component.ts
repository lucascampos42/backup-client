import { Component } from '@angular/core';
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 'app-nuvem',
  standalone: true,
    imports: [
        MenuComponent
    ],
  templateUrl: './nuvem.component.html',
  styleUrl: './nuvem.component.css'
})
export class NuvemComponent {

}
