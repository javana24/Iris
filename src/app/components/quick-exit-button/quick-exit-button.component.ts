import { Component, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';

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
    constructor(private injector: Injector) {}

    async quickExit(): Promise<void> {
        this.clearLocalTrace();
        // Mientras esta pestaña siga abierta, volver atrás redirige otra vez fuera (ver AppComponent).
        sessionStorage.setItem(QUICK_EXIT_FLAG, 'true');

        await Promise.race([
            this.signOut(),
            new Promise((resolve) => setTimeout(resolve, SIGN_OUT_TIMEOUT_MS))
        ]);

        window.location.replace(EXIT_URL);
    }

    /**
     * Cierra la sesión de Firebase para que quien abra la web después no vea la cuenta.
     * Se importa bajo demanda: este botón está en todas las páginas y Firebase pesa mucho.
     */
    private async signOut(): Promise<void> {
        try {
            const { FirebaseAuthService } = await import('../../services/firebase-auth.service');
            await this.injector.get(FirebaseAuthService).logout();
        } catch {
            // Sin sesión o sin Firebase inicializado: no hay nada que cerrar.
        }
    }

    private clearLocalTrace(): void {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(APP_STORAGE_PREFIX) || APP_STORAGE_KEYS.includes(key))
            .forEach((key) => localStorage.removeItem(key));
    }
}
