import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';

// Capacitor se inicializa automáticamente cuando está instalado
// El import es opcional y solo se usa si Capacitor está disponible

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' })
    ),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
