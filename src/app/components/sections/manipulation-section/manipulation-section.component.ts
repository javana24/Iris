import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeltId } from '../../../models/training-profile.model';
import { TrainingProfileService } from '../../../services/training-profile.service';

interface Question {
    text: string;
    options: { text: string; correct: boolean, feedback: string }[];
}

type QuestionOption = Question['options'][number];

interface Belt {
    id: 'white' | 'yellow' | 'purple' | 'black';
    name: string;
    description: string;
    color: string;
    locked: boolean;
    completed: boolean;
    questions: Question[];
    currentQuestionIndex: number;
}

const MOBILE_DOJO_QUESTIONS: Question[] = [
    {
        text: 'Tu pareja revisa constantemente tus mensajes y cuestiona tu memoria sobre eventos pasados. ¿Qué comportamiento es este?',
        options: [
            { text: 'Protección excesiva', correct: false, feedback: 'Interés genuino por tu seguridad digital.' },
            { text: 'Gaslighting y control', correct: true, feedback: 'Manipulación para invalidar tu percepción y autonomía.' },
            { text: 'Inseguridad temporal', correct: false, feedback: 'Falta de confianza puntual basada en el pasado.' },
            { text: 'Transparencia radical', correct: false, feedback: 'Acuerdo mutuo de honestidad sin límites.' }
        ]
    },
    {
        text: 'Si alguien insiste en decidir por ti con la excusa de cuidarte, ¿qué señal prioritaria debes identificar?',
        options: [
            { text: 'Romanticismo intenso', correct: false, feedback: 'Muestra de amor a largo plazo.' },
            { text: 'Control encubierto', correct: true, feedback: 'Sustitución de tu criterio por imposición progresiva.' },
            { text: 'Comunicación directa', correct: false, feedback: 'Diálogo sano para tomar decisiones.' },
            { text: 'Apoyo logístico', correct: false, feedback: 'Ayuda puntual sin presión.' }
        ]
    },
    {
        text: 'Ante una discusión, ¿cuál respuesta es más asertiva para proteger tus límites?',
        options: [
            { text: 'Ceder para evitar conflicto', correct: false, feedback: 'Prioriza la calma inmediata sobre tu seguridad.' },
            { text: 'Guardar silencio total', correct: false, feedback: 'No expresa necesidad ni límite.' },
            { text: 'Nombrar el límite y la consecuencia', correct: true, feedback: 'Comunicación clara, firme y sin agresión.' },
            { text: 'Responder con ataque', correct: false, feedback: 'Escala la situación y te expone más.' }
        ]
    }
];

@Component({
    selector: 'app-manipulation-section',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './manipulation-section.component.html',
    styleUrl: './manipulation-section.component.scss'
})

export class ManipulationSectionComponent {
    activeBeltId: string = 'white';

    belts: Belt[] = [
        {
            id: 'white',
            name: 'Reconociendo la Manipulación',
            description: 'Identifica señales de alerta en entornos sociales y digitales.',
            color: 'bg-white text-neutral-900 border-neutral-200',
            locked: false,
            completed: false,
            currentQuestionIndex: 0,
            questions: MOBILE_DOJO_QUESTIONS
        },
        {
            id: 'yellow',
            name: 'Límites Saludables',
            description: 'Técnicas prácticas para establecer y mantener tus espacios.',
            color: 'bg-amber-400 text-amber-950 border-amber-500',
            locked: true,
            completed: false,
            currentQuestionIndex: 0,
            questions: MOBILE_DOJO_QUESTIONS
        },
        {
            id: 'purple',
            name: 'Comunicación Asertiva',
            description: 'El poder de tu voz en situaciones críticas.',
            color: 'bg-purple-600 text-white border-purple-700',
            locked: true,
            completed: false,
            currentQuestionIndex: 0,
            questions: MOBILE_DOJO_QUESTIONS
        },
        {
            id: 'black',
            name: 'Espacio Seguro',
            description: 'Crea y protege tu entorno de seguridad personal.',
            color: 'bg-neutral-900 text-white border-neutral-700 shadow-xl shadow-black/50',
            locked: true,
            completed: false,
            currentQuestionIndex: 0,
            questions: MOBILE_DOJO_QUESTIONS
        }
    ];

    selectedOption: QuestionOption | null = null;
    showFeedback: boolean = false;
    isCorrect: boolean = false;
    hasFailedCompletion: boolean = false;
    lastScore: number = 0;
    private correctQuestionIndexes = new Set<number>();

    constructor(private trainingProfileService: TrainingProfileService) {
        this.hydrateProgress();
    }

    get activeBelt() {
        return this.belts.find(b => b.id === this.activeBeltId);
    }

    setActiveTab(beltId: string) {
        const belt = this.belts.find(b => b.id === beltId);
        if (belt && !belt.locked) {
            this.activeBeltId = beltId;
            this.resetLessonAttempt();
        }
    }

    selectOption(option: QuestionOption) {
        if (this.showFeedback) return;
        const belt = this.activeBelt;
        if (!belt) return;

        this.selectedOption = option;
        this.isCorrect = option.correct;
        this.showFeedback = true;

        if (option.correct) {
            this.correctQuestionIndexes.add(belt.currentQuestionIndex);
        }
    }

    nextQuestion() {
        const belt = this.activeBelt;
        if (!belt) return;

        if (belt.currentQuestionIndex < belt.questions.length - 1) {
            belt.currentQuestionIndex++;
            this.resetSelection();
            return;
        }

        this.lastScore = this.calculateScore(belt);

        if (this.lastScore < 70) {
            this.hasFailedCompletion = true;
            return;
        }

        belt.completed = true;
        this.trainingProfileService.recordDojoCompletion(belt.id);
        this.unlockNextBelt(belt.id);
        this.resetSelection();
    }

    retryLesson() {
        const belt = this.activeBelt;
        if (!belt) return;

        belt.currentQuestionIndex = 0;
        this.resetLessonAttempt();
    }

    getFeedbackActionLabel(): string {
        const belt = this.activeBelt;
        if (!belt) return 'Continuar';

        return belt.currentQuestionIndex < belt.questions.length - 1
            ? 'Siguiente pregunta'
            : 'Ver resultado';
    }

    unlockNextBelt(currentBeltId: string) {
        const currentIndex = this.belts.findIndex(b => b.id === currentBeltId);
        if (currentIndex !== -1 && currentIndex < this.belts.length - 1) {
            this.belts[currentIndex + 1].locked = false;
        }
    }

    goToNextBelt() {
        const currentIndex = this.belts.findIndex(b => b.id === this.activeBeltId);
        if (currentIndex !== -1 && currentIndex < this.belts.length - 1) {
            this.setActiveTab(this.belts[currentIndex + 1].id);
        }
    }

    resetSelection() {
        this.selectedOption = null;
        this.showFeedback = false;
        this.isCorrect = false;
    }

    private resetLessonAttempt(): void {
        this.correctQuestionIndexes = new Set<number>();
        this.hasFailedCompletion = false;
        this.lastScore = 0;
        this.resetSelection();
    }

    private calculateScore(belt: Belt): number {
        const totalQuestions = belt.questions.length || 1;
        return Math.floor((this.correctQuestionIndexes.size / totalQuestions) * 100);
    }

    private hydrateProgress(): void {
        const progress = this.trainingProfileService.getSnapshot().progress;
        const completedBelts = new Set<BeltId>(progress.completedBelts);
        const order = this.belts.map((belt) => belt.id);
        const nextUnlockedIndex = Math.min(completedBelts.size, order.length - 1);

        this.belts = this.belts.map((belt, index) => ({
            ...belt,
            completed: completedBelts.has(belt.id),
            locked: index > nextUnlockedIndex && !completedBelts.has(belt.id)
        }));

        this.activeBeltId = progress.currentBeltId;
        const activeBelt = this.belts.find((belt) => belt.id === this.activeBeltId);
        if (!activeBelt || activeBelt.locked) {
            this.activeBeltId = this.belts.find((belt) => !belt.locked)?.id ?? 'white';
        }
    }

    downloadCertificate() {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Certificado IRIS</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; text-align: center; padding: 50px; border: 20px solid #7e22ce; color: #333; }
                        h1 { color: #7e22ce; font-size: 48px; margin-bottom: 20px; }
                        h2 { font-size: 24px; margin-bottom: 40px; }
                        .name { font-size: 36px; font-weight: bold; border-bottom: 2px solid #333; display: inline-block; padding: 0 20px 10px; margin-bottom: 40px; }
                        .logo { font-size: 60px; margin-bottom: 20px; }
                        .date { font-size: 18px; color: #666; }
                    </style>
                </head>
                <body>
                    <div class="logo">👁️ IRIS</div>
                    <h1>Certificado de Excelencia</h1>
                    <h2>En Detección y Dojo de Defensa</h2>
                    <p>Este documento certifica que</p>
                    <div class="name">Agente del Cambio</div>
                    <p>Ha completado con éxito la ruta de niveles del Dojo IRIS.</p>
                    <p class="date">Fecha: ${new Date().toLocaleDateString()}</p>
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
