import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../services/translation.service';
import { AiService } from '../../../services/ai.service';

type Severity = 'low' | 'medium' | 'high';
type ChatRole = 'user' | 'assistant';

interface Finding {
  id: string;
  label: string;
  description: string;
  severity: Severity;
}

interface ChatMessage {
  role: ChatRole;
  text: string;
  findings: Finding[];
  timestamp: string;
}

@Component({
  selector: 'app-solution-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solution-section.component.html',
  styleUrl: './solution-section.component.scss'
})
export class SolutionSectionComponent {
  constructor(
    public translationService: TranslationService,
    private aiService: AiService
  ) {}

  inputText = '';
  messages: ChatMessage[] = [];
  lastFindings: Finding[] = [];
  showSummary = false;
  summaryItems: Array<{ finding: Finding; count: number }> = [];
  isLoading = false;
  errorMessage = '';

  // -------------------------------------------------------------------------
  // REGLAS DE DETECCIÓN POR PATRONES (REGEX)
  // Se analizan tanto con acentos como sin ellos (normalizado)
  // -------------------------------------------------------------------------
  private rules: Array<{ finding: Finding; patterns: RegExp[] }> = [
    // 1. VIOLENCIA FÍSICA (Expandida)
    {
      finding: {
        id: 'physical_violence',
        label: 'Violencia física',
        description: 'Agresiones físicas, daño corporal o retención.',
        severity: 'high'
      },
      patterns: [
        /me pega|me pego|me ha pegado/i,
        /me golpea|me golpe[oó]|me ha golpeado/i,
        /me empuja|me empuj[oó]|me ha empujado/i,
        /me zarandea|me zarande[oó]/i,
        /me hizo da[nñ]o|me ha hecho da[nñ]o/i,
        /me lastima|me lastim[oó]|me ha lastimado/i,
        /me agarra fuerte|me agarr[oó] fuerte/i,
        /me lanz[oó]|me tir[oó]|arroj[oó] algo/i,
        /me escupi[oó]|me ha escupido/i,
        /me encerr[oó]|no me dej[oó] salir/i,
        /me dio una cachetada|me abofete[oó]/i,
        /me agarr[oó] del cuello|me apret[oó] el cuello/i,
        /me ahorca|me ahorc[oó]/i,
        /me inmoviliza|me inmoviliz[oó]/i,
        /me dio una bofetada|me dio una palmada/i,
        /me pellizca|me jal[aó] del pelo/i
      ]
    },
    // 2. VIOLENCIA SEXUAL (Nueva categoría crítica)
    {
      finding: {
        id: 'sexual_violence',
        label: 'Violencia sexual',
        description: 'Coerción sexual o no respeto al consentimiento.',
        severity: 'high'
      },
      patterns: [
        /me oblig[oó] a tener sexo/i,
        /no quería y lo hizo igual/i,
        /no respeta mi no/i,
        /me toc[oó] sin mi permiso/i,
        /me fuerza|me forz[oó]/i,
        /quiere que haga cosas que no quiero/i,
        /me insiste para tener relaciones/i,
        /se quit[oó] el cond[oó]n/i,
        /me presiona para enviar fotos/i,
        /me chantajea con fotos/i,
        /me pide sexo para arreglar|para perdonar/i
      ]
    },
    // 3. CONTROL Y CIBERCONTROL (Expandida)
    {
      finding: {
        id: 'control',
        label: 'Control y Vigilancia',
        description: 'Conductas de control, vigilancia digital o presencial.',
        severity: 'medium'
      },
      patterns: [
        /m[eé]ndame ubicaci[oó]n/i,
        /d[oó]nde est[aá]s/i,
        /quiero saber con qui[eé]n est[aá]s/i,
        /te vigilo|te estoy vigilando/i,
        /revisa mi m[oó]vil|revisa mi celular/i,
        /pide mis contraseñas|tiene mis claves/i,
        /me proh[ií]be salir/i,
        /me controla la ropa|no le gusta como visto/i,
        /me llama a cada rato/i,
        /se mete en mis redes/i,
        /me exige videollamada/i,
        /me pide capturas/i,
        /me revisa el whatsapp/i,
        /me exige ubicacion en tiempo real/i
      ]
    },
    // 4. VIOLENCIA ECONÓMICA (Nueva categoría)
    {
      finding: {
        id: 'economic_violence',
        label: 'Violencia económica',
        description: 'Control de recursos financieros o sabotaje laboral.',
        severity: 'medium'
      },
      patterns: [
        /me quita el dinero|me pide el dinero/i,
        /controla mis gastos/i,
        /no me deja trabajar/i,
        /me pide tickets de todo/i,
        /dice que el dinero es suyo/i,
        /me rompi[oó] el m[oó]vil|me rompi[oó] la ropa/i, // Daño a bienes
        /no me pasa la pensi[oó]n/i
      ]
    },
    {
      finding: {
        id: 'verbal_violence',
        label: 'Violencia verbal',
        description: 'Gritos, insultos, humillaciones o desprecio.',
        severity: 'high'
      },
      patterns: [
        /me grita|me chilla/i,
        /me insulta|me humilla/i,
        /me desprecia|me ridiculiza/i,
        /se burla de m[ií]/i,
        /me dice que soy inutil|in[úu]til/i
      ]
    },
    // 5. VIOLENCIA VICARIA / AMENAZAS CON HIJOS O MASCOTAS (Nueva categoría)
    {
      finding: {
        id: 'vicarious_violence',
        label: 'Amenaza Vicaria (Hijos/Mascotas)',
        description: 'Usar a seres queridos para hacer daño.',
        severity: 'high'
      },
      patterns: [
        /te voy a quitar a los niñ/i,
        /no ver[aá]s m[aá]s a tus hijos/i,
        /le har[aá] da[nñ]o al perro|al gato/i,
        /habla mal de m[ií] a los niñ/i,
        /me amenaza con llevarse a los niñ/i
      ]
    },
    // 6. GASLIGHTING (Luz de Gas)
    {
      finding: {
        id: 'gaslighting',
        label: 'Gaslighting (Luz de Gas)',
        description: 'Minimizar, negar o manipular la percepción de la realidad.',
        severity: 'medium'
      },
      patterns: [
        /est[aá]s loca|est[aá]s loco/i,
        /te lo est[aá]s inventando/i,
        /eso nunca pas[oó]/i,
        /exageras todo|eres una exagerada/i,
        /eres muy sensible/i,
        /son imaginaciones tuyas/i,
        /yo nunca dije eso/i
      ]
    },
    // 7. AISLAMIENTO
    {
      finding: {
        id: 'isolation',
        label: 'Aislamiento',
        description: 'Intento de separar de amigos o familia.',
        severity: 'high'
      },
      patterns: [
        /no quiero que veas a/i,
        /deja a tus amigas|deja a tus amigos/i,
        /tu familia no te conviene/i,
        /solo me tienes a m[ií]/i,
        /tus amigos son mala influencia/i,
        /se enfada si salgo/i,
        /prefiere que nos quedemos en casa siempre/i
      ]
    },
    // 8. AMENAZAS
    {
      finding: {
        id: 'threats',
        label: 'Amenazas',
        description: 'Amenazas de daño, abandono o suicidio.',
        severity: 'high'
      },
      patterns: [
        /si no .* terminamos/i,
        /si no .* te dejo/i,
        /vas a arrepentirte/i,
        /te voy a matar|te voy a pegar/i,
        /me voy a matar si me dejas/i, // Amenaza de suicidio como control
        /ya ver[aá]s lo que pasa/i,
        /te vas a acordar de m[ií]/i,
        /voy a arruinarte/i
      ]
    },
    // 9. INSULTOS Y HUMILLACIÓN
    {
      finding: {
        id: 'insults',
        label: 'Insultos y Humillación',
        description: 'Lenguaje despectivo, burla o humillación pública.',
        severity: 'high'
      },
      patterns: [
        /eres una basura|eres una mierda/i,
        /no vales nada/i,
        /nadie te va a querer/i,
        /idiota|imb[eé]cil|est[uú]pida|zorra|puta/i,
        /me critica delante de gente/i,
        /se burla de m[ií]/i,
        /me grita/i,
        /me llama loca|me llama hist[eé]rica/i,
        /me dice que no sirvo/i
      ]
    },
    // 10. CELOS PATOLÓGICOS
    {
      finding: {
        id: 'jealousy',
        label: 'Celos Posesivos',
        description: 'Celos que se presentan como cuidado o amor, o posesión.',
        severity: 'low'
      },
      patterns: [
        /si me quisieras/i,
        /si me amaras harías/i,
        /eres m[ií]a|eres m[ií]o/i,
        /te celo porque te amo/i,
        /quién era ese|quién era esa/i,
        /por qué miraste a/i,
        /no quiero que hables con/i,
        /no me gusta que tengas amigos/i
      ]
    },
    // 11. COERCIÓN Y CHANTAJE
    {
      finding: {
        id: 'coercion',
        label: 'Coerción y Chantaje',
        description: 'Presión para realizar actos no deseados.',
        severity: 'high'
      },
      patterns: [
        /si no mandas la foto/i,
        /demu[eé]stramelo haciendo/i,
        /si no haces esto no me quieres/i,
        /te voy a bloquear si no/i,
        /si me dejas me arruinas/i,
        /no tienes derecho a decir que no/i
      ]
    },
    // 12. PONE EN RIESGO LA SALUD
    {
      finding: {
        id: 'health_risk',
        label: 'Riesgo para la salud',
        description: 'Conductas que ponen en peligro la salud física o mental.',
        severity: 'high'
      },
      patterns: [
        /no me deja ir al m[eé]dico/i,
        /me quita la medicaci[oó]n/i,
        /me impide dormir|no me deja dormir/i,
        /me niega comida|no me deja comer/i,
        /me contagia|me expone a enfermedades/i,
        /me obliga a beber|me obliga a consumir/i,
        /me amenaza con enfermarme/i,
        /me impide ir a terapia/i,
        /me controla el embarazo|me impide anticonceptivos/i
      ]
    }
  ];

  // -------------------------------------------------------------------------
  // ALERTA POR PALABRAS SUELTAS (Keyword Match)
  // Útil cuando el usuario usa términos técnicos o slang sin frase completa
  // -------------------------------------------------------------------------
  private keywordAlert: Finding = {
    id: 'keyword_alert',
    label: 'Término de Alerta Detectado',
    description: 'Se detectó una palabra clave asociada a dinámicas de abuso.',
    severity: 'medium' // Lo ponemos en medium para revisar contexto
  };

  private keywordList: string[] = [
    // Manipulación Psicológica
    'gaslighting', 'luz de gas', 'love bombing', 'bombardeo de amor',
    'hoovering', 'ley del hielo', 'tratamiento de silencio', 'stonewalling',
    'triangulación', 'chantaje emocional', 'manipulación', 'victimización',
    'invalidación', 'menosprecio', 'humillación', 'disonancia cognitiva',
    'vinculo traumatico', 'indefensión aprendida', 'proyección',
    'devaluacion', 'idealizacion', 'dependencia emocional', 'culpabilizacion',
    'amenaza de suicidio', 'se hace la victima', 'castigo silencioso',
    
    // Control y Aislamiento
    'aislamiento', 'celos', 'celotipia', 'posesividad', 'control',
    'control coercitivo', 'cibercontrol', 'geolocalización', 'ubicación',
    'revisar movil', 'revisar celular', 'pedir contraseñas', 'prohibir',
    'stalking', 'stalkear', 'acoso', 'vigilancia', 'chequear', 'fiscalizar',
    
    // Violencia Digital
    'sextorsión', 'pornovenganza', 'difusión de fotos', 'pack', 'packes',
    'amenaza con fotos', 'publicar fotos', 'exponer fotos',
    
    // Comportamientos
    'amenazas', 'intimidación', 'coacción', 'mansplaining', 'negging',
    'breadcrumbing', 'ghosting', 'narcisista', 'narcisismo', 'psicópata',
    'sociópata', 'codependencia', 'pasivo-agresivo', 'agresividad',
    'humillacion', 'desprecio', 'ridiculizar', 'insulto', 'gritos',
    
    // Tipos de Violencia
    'violencia vicaria', 'violencia economica', 'violencia fisica',
    'violencia verbal', 'violencia sexual', 'violencia psicologica',
    'violencia de genero', 'violencia machista', 'violencia domestica',
    'violencia en pareja', 'violencia sentimental',
    
    // Acciones físicas/agresivas
    'golpes', 'empujones', 'zarandeos', 'portazos', 'gritos', 'insultos',
    'desvalorización', 'culpa', 'miedo', 'sumisión', 'dominación',
    'romper objetos', 'puñetazo', 'bofetada', 'patada', 'ahorcar', 'asfixiar',
    'cachetada', 'abofetear', 'golpear', 'empujar', 'estrangular',
    
    // Sentimientos de la víctima
    'miedo a el', 'miedo a ella', 'caminar sobre huevos', 'no se como actuar',
    'tengo miedo', 'me siento atrapada', 'me siento atrapado',
    
    // Riesgo para la salud
    'me quita la medicacion', 'no me deja ir al medico', 'me impide dormir',
    'me niega comida', 'me deja sin comer', 'me obliga a beber',
    'me obliga a consumir', 'me impide ir a terapia', 'me contagia',
    'me expone a enfermedades'
  ];

  sendMessage(): void {
    const text = this.inputText.trim();
    if (!text) {
      return;
    }

    const findings = this.analyze(text);
    const message: ChatMessage = {
      role: 'user',
      text,
      findings,
      timestamp: new Date().toLocaleTimeString().slice(0, 5)
    };

    this.messages = [...this.messages, message];
    this.lastFindings = findings;
    this.inputText = '';
    this.updateSummary(findings);
    this.errorMessage = '';

    this.isLoading = true;
    const payload = this.messages
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role, text: m.text }));

    const lang = this.translationService.getCurrentLanguageValue();
    this.aiService.chat(payload, lang).subscribe({
      next: (res) => {
        const responseText = res.response?.trim() || this.translationService.translate('ai_response_fallback');
        const response: ChatMessage = {
          role: 'assistant',
          text: responseText,
          findings: [],
          timestamp: new Date().toLocaleTimeString().slice(0, 5)
        };
        this.messages = [...this.messages, response];
        if (findings.length > 0) {
          const detectionText = this.generateDetectionNotice(findings);
          const detectionMessage: ChatMessage = {
            role: 'assistant',
            text: detectionText,
            findings: [],
            timestamp: new Date().toLocaleTimeString().slice(0, 5)
          };
          this.messages = [...this.messages, detectionMessage];
        }
        this.errorMessage = ''; // Limpiar error si hay éxito
      },
      error: (err) => {
        console.error('Error en componente:', err);
        const errorMsg = this.translationService.translate('ai_response_error');
        // Añadir información de debug en modo desarrollo
        const debugInfo = ` (URL: ${this.aiService.getCurrentUrl()})`;
        this.errorMessage = errorMsg + debugInfo;
        console.error('Mensaje de error mostrado:', this.errorMessage);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  clearChat(): void {
    this.messages = [];
    this.lastFindings = [];
    this.inputText = '';
    this.summaryItems = [];
    this.showSummary = false;
    this.errorMessage = '';
  }

  getSeverityClass(severity: Severity): string {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-purple-100 text-purple-700 border-purple-300';
    }
  }

  private analyze(text: string): Finding[] {
    const matches: Finding[] = [];
    // Normalizamos el texto (quitamos acentos) para facilitar búsquedas generales
    const normalized = this.normalizeText(text);

    for (const rule of this.rules) {
      // Probamos el patrón contra el texto original Y contra el normalizado
      if (rule.patterns.some((pattern) => pattern.test(text) || pattern.test(normalized))) {
        // Evitamos duplicar la misma "finding" si matchea varios patrones de la misma regla
        if (!matches.some(m => m.id === rule.finding.id)) {
            matches.push(rule.finding);
        }
      }
    }
    
    // Si no hay reglas específicas, buscamos palabras sueltas
    if (this.containsKeyword(normalized)) {
      // Solo añadimos alerta de keyword si no se ha detectado ya algo más específico
      // O podemos añadirlo siempre como complemento. Aquí lo añado siempre.
      matches.push(this.keywordAlert);
    }
    return matches;
  }

  private containsKeyword(text: string): boolean {
    const lower = text.toLowerCase();
    // Buscamos si alguna palabra clave está incluida
    return this.keywordList.some((term) => lower.includes(term));
  }

  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  private generateDetectionNotice(findings: Finding[]): string {
    const labels = findings.map((f) => f.label).join(', ');
    const high = findings.some((f) => f.severity === 'high');
    const medium = findings.some((f) => f.severity === 'medium');

    if (high) {
      return this.translationService.translate('ai_response_high') + ' ' +
        this.translationService.translate('ai_response_detected') + ` ${labels}.`;
    }
    if (medium) {
      return this.translationService.translate('ai_response_medium') + ' ' +
        this.translationService.translate('ai_response_detected') + ` ${labels}.`;
    }
    return this.translationService.translate('ai_response_low') + ' ' +
      this.translationService.translate('ai_response_detected') + ` ${labels}.`;
  }

  toggleSummary(): void {
    this.showSummary = !this.showSummary;
  }

  private updateSummary(findings: Finding[]): void {
    if (findings.length === 0) {
      return;
    }

    const map = new Map<string, { finding: Finding; count: number }>();
    for (const item of this.summaryItems) {
      map.set(item.finding.id, { finding: item.finding, count: item.count });
    }
    for (const finding of findings) {
      const existing = map.get(finding.id);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(finding.id, { finding, count: 1 });
      }
    }
    this.summaryItems = Array.from(map.values());
  }
}