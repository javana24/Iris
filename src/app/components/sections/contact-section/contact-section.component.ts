import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-section.component.html',
  styleUrl: './contact-section.component.scss'
})
export class ContactSectionComponent {
  constructor(public translationService: TranslationService) { }

  downloadReport() {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      const date = new Date().toLocaleDateString();
      printWindow.document.write(`
        <html>
        <head>
            <title>Reporte Proyecto IRIS</title>
            <style>
                body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                header { text-align: center; border-bottom: 2px solid #7e22ce; padding-bottom: 20px; margin-bottom: 30px; }
                h1 { color: #7e22ce; margin: 0; font-size: 28px; }
                .subtitle { color: #666; font-size: 16px; margin-top: 5px; }
                .section { margin-bottom: 30px; }
                h2 { color: #d97706; font-size: 20px; border-left: 4px solid #d97706; padding-left: 10px; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
                .highlight { background: #f3f4f6; padding: 15px; border-radius: 8px; }
            </style>
        </head>
        <body>
            <header>
                <h1>👁️ Proyecto IRIS</h1>
                <div class="subtitle">Innovación Social para la Prevención de Violencia de Género</div>
            </header>

            <div class="section">
                <h2>Sobre el Proyecto</h2>
                <p>IRIS es una herramienta educativa diseñada para ayudar a identificar y prevenir la violencia invisible en las relaciones de pareja a través de simulaciones con Inteligencia Artificial.</p>
            </div>

            <div class="section">
                <h2>Recursos Clave</h2>
                <ul>
                    <li><strong>Chatbot Educativo:</strong> Asistente virtual para resolver dudas sobre violencia de género.</li>
                    <li><strong>Simulador de Pareja:</strong> Entrenamiento práctico para detectar banderas rojas.</li>
                    <li><strong>Protocolos de Seguridad:</strong> Detección automática de riesgos y derivación a profesionales.</li>
                </ul>
            </div>

            <div class="section highlight">
                <h2>Compromiso</h2>
                <p>Este documento certifica el acceso a los recursos de prevención y concienciación del Proyecto IRIS.</p>
                <p><strong>Recuerda:</strong> La violencia no siempre deja marcas físicas. Confía en tu intuición.</p>
            </div>

            <div class="section">
                <h2>Contacto y Ayuda</h2>
                <p>Si tú o alguien que conoces necesita ayuda:</p>
                <ul>
                    <li>📞 <strong>016</strong> (Atención a víctimas, no deja rastro)</li>
                    <li>🌐 <a href="#">recursos.iris.org</a></li>
                </ul>
            </div>

            <div class="footer">
                Generado el ${date} • Proyecto IRIS
            </div>
            <script>
                window.onload = function() { window.print(); }
            </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  }
}
