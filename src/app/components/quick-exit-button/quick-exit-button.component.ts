import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-quick-exit-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quick-exit-button.component.html',
    styleUrls: ['./quick-exit-button.component.scss']
})
export class QuickExitButtonComponent {

    quickExit() {
        // Redirigir a Google inmediatamente
        window.location.replace("https://www.google.com");
    }

}
