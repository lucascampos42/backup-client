import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BackgroundService {
    startBackgroundTask(): void {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            }).catch(error => {
                console.error('Service Worker registration failed:', error);
            });
        }
    }
}