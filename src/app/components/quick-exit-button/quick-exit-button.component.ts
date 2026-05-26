import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

const QUICK_EXIT_FLAG = 'iris.quick-exit.active';
const EXIT_URL = 'https://www.google.com';
const APP_STORAGE_PREFIX = 'iris.';
const APP_STORAGE_KEYS = ['language'];

@Component({
    selector: 'app-quick-exit-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quick-exit-button.component.html',
    styleUrls: ['./quick-exit-button.component.scss']
})
export class QuickExitButtonComponent {

    quickExit(): void {
        this.clearLocalTrace();
        sessionStorage.setItem(QUICK_EXIT_FLAG, 'true');
        window.location.replace(EXIT_URL);
    }

    private clearLocalTrace(): void {
        Object.keys(localStorage)
            .filter((key) => key.startsWith(APP_STORAGE_PREFIX) || APP_STORAGE_KEYS.includes(key))
            .forEach((key) => localStorage.removeItem(key));
    }
}
