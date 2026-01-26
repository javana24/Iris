import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
                    text: 'Se enfada porque has llegado tarde, pero te dice: "Estaba preocupado, por favor avísame la próxima vez".',
                    options: [
                        { text: 'Es control sutil', correct: false, feedback: 'Pedir comunicación desde la preocupación real es sano.' },
                        { text: 'Comunicación Saludable', correct: true, feedback: 'Correcto. Expresa su sentimiento sin insultar ni castigar.' },
                        { text: 'Es un exagerado', correct: false, feedback: 'Preocuparse es normal si hay respeto.' },
                        { text: 'Me está vigilando', correct: false, feedback: 'Pedir que avises por seguridad no es vigilancia.' }
                    ]
                },
                {
                    text: 'Cuando se enfada, golpea la pared cerca de tu cara.',
                    options: [
                        { text: 'Tiene mucho temperamento', correct: false, feedback: 'El temperamento no justifica la violencia.' },
                        { text: 'Es intimidación física', correct: true, feedback: 'Exacto. Golpear objetos cerca de ti es una amenaza física.' },
                        { text: 'Es normal', correct: false, feedback: 'La violencia nunca es normal.' },
                        { text: 'Mejor no enfadarle', correct: false, feedback: 'No eres responsable de su ira.' }
                    ]
                },
                {
                    text: 'Te dice que te queda genial ese vestido y que disfrutes con tus amigas.',
                    options: [
                        { text: 'Seguro miente', correct: false, feedback: 'Acepta los cumplidos, no busques maldad donde no la hay.' },
                        { text: 'Apoyo y Respeto', correct: true, feedback: 'Correcto. Fomentar tu independencia y autoestima es amor sano.' },
                        { text: 'Quiere algo a cambio', correct: false, feedback: 'El amor sano no es transaccional.' },
                        { text: 'Me quiere echar de casa', correct: false, feedback: 'Disfrutar tu tiempo libre es sano.' }
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
                    text: 'Tenéis una discusión y te dice: "Entiendo tu punto de vista, aunque no estoy de acuerdo. Busquemos una solución".',
                    options: [
                        { text: 'Me está ignorando', correct: false, feedback: 'Validar tu opinión aunque no concuerde es respeto.' },
                        { text: 'Resolución de Conflictos Sana', correct: true, feedback: 'Correcto. Escuchar y negociar es la base de una relación sana.' },
                        { text: 'Es débil', correct: false, feedback: 'Ceder o negociar no es debilidad.' },
                        { text: 'Gaslighting', correct: false, feedback: 'Aquí no niega tu realidad, la respeta.' }
                    ]
                },
                {
                    text: 'Te dice: "Estás loca, eso nunca pasó, te lo estás imaginando".',
                    options: [
                        { text: 'Quizás tengo mala memoria', correct: false, feedback: 'Dudar de ti misma es el objetivo del manipulador.' },
                        { text: 'Gaslighting (Luz de Gas)', correct: true, feedback: 'Correcto. Te hace dudar de tu cordura para anularte.' },
                        { text: 'Es una broma', correct: false, feedback: 'No es gracioso invalidar tu realidad.' },
                        { text: 'Tiene razón', correct: false, feedback: 'Confía en tu criterio. No estás loca.' }
                    ]
                },
                {
                    text: 'Le pides que no revise tu móvil y él/ella lo respeta sin enfadarse.',
                    options: [
                        { text: 'Seguro oculta algo', correct: false, feedback: 'Respetar límites es señal de confianza, no de culpa.' },
                        { text: 'Respeto a la Privacidad', correct: true, feedback: 'Correcto. La privacidad es un derecho, no un secreto.' },
                        { text: 'No le importo', correct: false, feedback: 'El respeto es la mayor forma de importar.' },
                        { text: 'Es indiferencia', correct: false, feedback: 'Es respeto, no indiferencia.' }
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
                    text: '"Si me dejas, me mato. No puedo vivir sin ti."',
                    options: [
                        { text: 'Amor verdadero', correct: false, feedback: 'Esto no es amor, es desesperación y control.' },
                        { text: 'Chantaje Emocional Extremo', correct: true, feedback: 'Correcto. Te responsabiliza de su vida para atraparte.' },
                        { text: 'Debo cuidarle', correct: false, feedback: 'Necesita ayuda profesional, no tu sacrificio.' },
                        { text: 'Pobre, sufre mucho', correct: false, feedback: 'Su sufrimiento no justifica atarte.' }
                    ]
                },
                {
                    text: 'Te anima a aceptar ese ascenso laboral aunque signifique viajar más.',
                    options: [
                        { text: 'Quiere que me vaya', correct: false, feedback: 'Alegrarse por tus logros es amor.' },
                        { text: 'Apoyo al Crecimiento', correct: true, feedback: 'Correcto. Una pareja sana celebra tus éxitos.' },
                        { text: 'Le da igual', correct: false, feedback: 'Apoyar no es indiferencia.' },
                        { text: 'Es egoísta', correct: false, feedback: 'Al contrario, prioriza tu felicidad.' }
                    ]
                },
                {
                    text: 'Rompe tus cosas favoritas "por accidente" sistemáticamente cuando discutís.',
                    options: [
                        { text: 'Es torpe', correct: false, feedback: 'La torpeza no ocurre solo en discusiones.' },
                        { text: 'Violencia instrumental', correct: true, feedback: 'Correcto. Destruye lo que amas para herirte indirectamente.' },
                        { text: 'Mala suerte', correct: false, feedback: 'No es suerte, es intencional.' },
                        { text: 'No pasa nada', correct: false, feedback: 'Sí pasa. Es violencia.' }
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
                        { text: 'Violencia Económica', correct: true, feedback: 'Correcto. Quitarte independencia financiera es violencia.' },
                        { text: 'Me administra', correct: false, feedback: 'Tú eres capaz de administrarte.' },
                        { text: 'Es por mi bien', correct: false, feedback: 'Es por su absoluto control.' }
                    ]
                },
                {
                    text: 'Tenéis cuentas separadas y un fondo común para gastos. Decidís juntos las grandes compras.',
                    options: [
                        { text: 'Falta de compromiso', correct: false, feedback: 'Compartir gastos y respetar independencia es compromiso.' },
                        { text: 'Independencia Financiera Sana', correct: true, feedback: 'Correcto. El dinero no debe ser herramienta de control.' },
                        { text: 'Es muy frío', correct: false, feedback: 'Es pragmático y justo.' },
                        { text: 'No confía en mí', correct: false, feedback: 'La autonomía no es desconfianza.' }
                    ]
                },
                {
                    text: 'Utiliza a tus hijos para mandarte mensajes hirientes o ponerlos en tu contra.',
                    options: [
                        { text: 'Están estresados', correct: false, feedback: 'Los adultos protegen a los niños, no los usan.' },
                        { text: 'Violencia Vicaria', correct: true, feedback: 'Correcto. Herirte a través de terceras personas es gravísimo.' },
                        { text: 'Es normal en rupturas', correct: false, feedback: 'Nunca es normal dañar a los hijos.' },
                        { text: 'Quiere atención', correct: false, feedback: 'Busca destruirte moralmente.' }
                    ]
                }
            ]
        }
    ];

    selectedOption: any = null;
    showFeedback: boolean = false;
    isCorrect: boolean = false;

    constructor() { }

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
