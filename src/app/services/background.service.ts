import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BackgroundService {
    stopBackgroundTask(): void {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister().then(success => {
                        if (success) {
                            console.log('ServiceWorker unregistered successfully.');
                        } else {
                            console.error('ServiceWorker unregistration failed.');
                        }
                    });
                }
            });
        }
    }

    startBackgroundTask(): void {
        // Código de registro do ServiceWorker removido
    }
}