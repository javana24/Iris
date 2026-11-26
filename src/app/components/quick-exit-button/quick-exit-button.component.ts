import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseAuthService } from '../../services/firebase-auth.service';

const QUICK_EXIT_FLAG = 'iris.quick-exit.active';
const EXIT_URL = 'https://www.google.com';
const APP_STORAGE_PREFIX = 'iris.';
const APP_STORAGE_KEYS = ['language'];
// Tiempo máximo que esperamos a cerrar la sesión antes de salir: la salida debe ser inmediata.
const SIGN_OUT_TIMEOUT_MS = 400;

@Component({
    selector: 'app-quick-exit-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quick-exit-button.component.html',
    styleUrls: ['./quick-exit-button.component.scss']
})
export class QuickExitButtonComponent {
    constructor(private firebaseAuthService: FirebaseAuthService) {}

    async quickExit(): Promise<void> {
        this.clearLocalTrace();
        // Mientras esta pestaña siga abierta, volver atrás redirige otra vez fuera (ver AppComponent).
        sessionStorage.setItem(QUICK_EXIT_FLAG, 'true');

        // Cerrar la sesión de Firebase para que quien abra la web después no vea la cuenta.
        await Promise.race([
            this.firebaseAuthService.logout().catch(() => undefined),
            new Promise((resolve) => setTimeout(resolve, SIGN_OUT_TIMEOUT_MS))
        ]);

        window.location.replace(EXIT_URL);
    }

    private clearLocalTrace(): void {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(APP_STORAGE_PREFIX) || APP_STORAGE_KEYS.includes(key))
            .forEach((key) => localStorage.removeItem(key));
    }
}
