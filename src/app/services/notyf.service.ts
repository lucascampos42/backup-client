import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

@Injectable({
    providedIn: 'root'
})
export class NotyfService {
    private notyf = new Notyf({
        position: {
            x: 'right',
            y: 'top',
        },
    });

    success(message: string): void {
        this.notyf.success(message);
    }

    error(message: string): void {
        this.notyf.error(message);
    }
}