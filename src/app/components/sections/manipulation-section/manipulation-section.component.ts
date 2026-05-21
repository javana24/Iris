import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BeltId } from '../../../models/training-profile.model';
import { TrainingProfileService } from '../../../services/training-profile.service';

interface Question {
    text: string;
    options: { text: string; correct: boolean, feedback: string }[];
}

interface Belt {
    id: 'white' | 'yellow' | 'purple' | 'black';
    name: string;
    color: string;
    locked: boolean;
    completed: boolean;
    questions: Question[];
    currentQuestionIndex: number;
}

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
            name: 'Cinturón Blanco',
            color: 'bg-white text-neutral-900 border-neutral-200',
            locked: false,
            completed: false,
            currentQuestionIndex: 0,
            questions: [
                {
                    text: '"Si me dejas, me mato. No puedo vivir sin ti."',
                    options: [
                        { text: 'Amor verdadero', correct: false, feedback: 'Esto no es amor, es desesperación y control.' },
                        { text: 'Debo cuidarle', correct: false, feedback: 'Necesita ayuda profesional, no tu sacrificio.' },
                        { text: 'Chantaje Emocional Extremo', correct: true, feedback: 'Correcto. Te responsabiliza de su vida para atraparte.' },
                        { text: 'Pobre, sufre mucho', correct: false, feedback: 'Su sufrimiento no justifica atarte.' }
                    ]
                },
                {
                    text: 'Te insulta directamente: "Eres una inútil, nadie te va a querer como yo".',
                    options: [
                        { text: 'Tiene razón', correct: false, feedback: 'Nadie tiene derecho a insultarte.' },
                        { text: 'Lo dice por mi bien', correct: false, feedback: 'Insultar nunca es por tu bien.' },
                        { text: 'Se le escapó', correct: false, feedback: 'La violencia verbal no es un accidente.' },
                        { text: 'Maltrato Verbal', correct: true, feedback: 'Correcto. Los insultos son violencia directa.' }
                    ]
                },
                {
                    text: 'Cuando se enfada, golpea la pared cerca de tu cara.',
                    options: [
                        { text: 'Tiene mucho temperamento', correct: false, feedback: 'El temperamento no justifica la violencia.' },
                        { text: 'Es normal', correct: false, feedback: 'La violencia nunca es normal.' },
                        { text: 'Es intimidación física', correct: true, feedback: 'Exacto. Golpear objetos cerca de ti es una amenaza física.' },
                        { text: 'Mejor no enfadarle', correct: false, feedback: 'No eres responsable de su ira.' }
                    ]
                }
            ]
        },
        {
            id: 'yellow',
            name: 'Cinturón Amarillo',
            color: 'bg-amber-400 text-amber-950 border-amber-500',
            locked: true,
            completed: false,
            currentQuestionIndex: 0,
            questions: [
                {
                    text: 'Te exige saber dónde estás en todo momento y que le mandes ubicación.',
                    options: [
                        { text: 'Se preocupa por mí', correct: false, feedback: 'La preocupación no exige control constante.' },
                        { text: 'Es romántico', correct: false, feedback: 'El control no es romanticismo.' },
                        { text: 'Control excesivo', correct: true, feedback: 'Correcto. Exigir ubicación constante es una forma de control.' },
                        { text: 'Es por seguridad', correct: false, feedback: 'Tú sabes cuidarte sola/o.' }
                    ]
                },
                {
                    text: 'Rompe tus cosas favoritas "por accidente" sistemáticamente cuando discutís.',
                    options: [
                        { text: 'Es torpe', correct: false, feedback: 'La torpeza no ocurre solo en discusiones.' },
                        { text: 'Mala suerte', correct: false, feedback: 'No es suerte, es intencional.' },
                        { text: 'Violencia instrumental', correct: true, feedback: 'Correcto. Destruye lo que amas para herirte indirectamente.' },
                        { text: 'No pasa nada', correct: false, feedback: 'Sí pasa. Es violencia.' }
                    ]
                },
                {
                    text: 'Le pides que no revise tu móvil y él/ella lo respeta sin enfadarse.',
                    options: [
                        { text: 'Seguro oculta algo', correct: false, feedback: 'Respetar límites es señal de confianza, no de culpa.' },
                        { text: 'No le importo', correct: false, feedback: 'El respeto es la mayor forma de importar.' },
                        { text: 'Es indiferencia', correct: false, feedback: 'Es respeto, no indiferencia.' },
                        { text: 'Respeto a la Privacidad', correct: true, feedback: 'Correcto. La privacidad es un derecho, no un secreto.' }
                    ]
                }
            ]
        },
        {
            id: 'purple',
            name: 'Cinturón Morado',
            color: 'bg-purple-600 text-white border-purple-700',
            locked: true,
            completed: false,
            currentQuestionIndex: 0,
            questions: [
                {
                    text: 'Te dice: "Estás loca, eso nunca pasó, te lo estás imaginando".',
                    options: [
                        { text: 'Gaslighting (Luz de Gas)', correct: true, feedback: 'Correcto. Te hace dudar de tu cordura para anularte.' },
                        { text: 'Quizás tengo mala memoria', correct: false, feedback: 'Dudar de ti misma es el objetivo del manipulador.' },
                        { text: 'Es una broma', correct: false, feedback: 'No es gracioso invalidar tu realidad.' },
                        { text: 'Tiene razón', correct: false, feedback: 'Confía en tu criterio. No estás loca.' }
                    ]
                },
                {
                    text: 'Te aísla completamente de tu familia, prohibiéndote verles.',
                    options: [
                        { text: 'Es porque me quiere solo', correct: false, feedback: 'El amor no aísla.' },
                        { text: 'Mi familia es mala', correct: false, feedback: 'Puede que haya conflictos, pero prohibir es violencia.' },
                        { text: 'Aislamiento Forzado', correct: true, feedback: 'Correcto. Cortar tus redes de apoyo es la fase final del control.' },
                        { text: 'Es celoso', correct: false, feedback: 'Es mucho más que celos, es secuestro emocional.' }
                    ]
                },
                {
                    text: 'Tenéis una discusión y te dice: "Entiendo tu punto de vista, aunque no estoy de acuerdo. Busquemos una solución".',
                    options: [
                        { text: 'Me está ignorando', correct: false, feedback: 'Validar tu opinión aunque no concuerde es respeto.' },
                        { text: 'Es débil', correct: false, feedback: 'Ceder o negociar no es debilidad.' },
                        { text: 'Resolución de Conflictos Sana', correct: true, feedback: 'Correcto. Escuchar y negociar es la base de una relación sana.' },
                        { text: 'Gaslighting', correct: false, feedback: 'Aquí no niega tu realidad, la respeta.' }
                    ]
                }
            ]
        },
        {
            id: 'black',
            name: 'Cinturón Negro',
            color: 'bg-neutral-900 text-white border-neutral-700 shadow-xl shadow-black/50',
            locked: true,
            completed: false,
            currentQuestionIndex: 0,
            questions: [
                {
                    text: 'Controla todo el dinero y te da una "paga" insuficiente aunque tú trabajes.',
                    options: [
                        { text: 'Es ahorrador', correct: false, feedback: 'Ahorrar es mutuo, esto es privación.' },
                        { text: 'Me administra', correct: false, feedback: 'Tú eres capaz de administrarte.' },
                        { text: 'Violencia Económica', correct: true, feedback: 'Correcto. Quitarte independencia financiera es violencia.' },
                        { text: 'Es por mi bien', correct: false, feedback: 'Es por su absoluto control.' }
                    ]
                },
                {
                    text: 'Utiliza a tus hijos para mandarte mensajes hirientes o ponerlos en tu contra.',
                    options: [
                        { text: 'Están estresados', correct: false, feedback: 'Los adultos protegen a los niños, no los usan.' },
                        { text: 'Es normal en rupturas', correct: false, feedback: 'Nunca es normal dañar a los hijos.' },
                        { text: 'Violencia Vicaria', correct: true, feedback: 'Correcto. Herirte a través de terceras personas es gravísimo.' },
                        { text: 'Quiere atención', correct: false, feedback: 'Busca destruirte moralmente.' }
                    ]
                },
                {
                    text: 'Tenéis cuentas separadas y un fondo común para gastos. Decidís juntos las grandes compras.',
                    options: [
                        { text: 'Falta de compromiso', correct: false, feedback: 'Compartir gastos y respetar independencia es compromiso.' },
                        { text: 'Es muy frío', correct: false, feedback: 'Es pragmático y justo.' },
                        { text: 'No confía en mí', correct: false, feedback: 'La autonomía no es desconfianza.' },
                        { text: 'Independencia Financiera Sana', correct: true, feedback: 'Correcto. El dinero no debe ser herramienta de control.' }
                    ]
                }
            ]
        }
    ];

    selectedOption: any = null;
    showFeedback: boolean = false;
    isCorrect: boolean = false;

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
            this.resetSelection();
        }
    }

    selectOption(option: any) {
        if (this.showFeedback) return;
        this.selectedOption = option;
        this.isCorrect = option.correct;
        this.showFeedback = true;
    }

    nextQuestion() {
        const belt = this.activeBelt;
        if (!belt) return;

        if (this.isCorrect) {
            if (belt.currentQuestionIndex < belt.questions.length - 1) {
                belt.currentQuestionIndex++;
                this.resetSelection();
            } else {
                // Belt Completed!
                belt.completed = true;
                this.trainingProfileService.recordDojoCompletion(belt.id);
                this.unlockNextBelt(belt.id);
            }
        } else {
            this.resetSelection();
        }
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
                    <h2>En Detección y Defensa Mental</h2>
                    <p>Este documento certifica que</p>
                    <div class="name">Agente del Cambio</div>
                    <p>Ha completado con éxito el entrenamiento de Cinturón Negro en el Dojo IRIS.</p>
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
