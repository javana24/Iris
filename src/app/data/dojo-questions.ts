// Banco de preguntas del Dojo de Defensa. Cada intento saca QUESTIONS_PER_ATTEMPT al azar
// del cinturón y baraja las opciones. El mismo contenido está en la app Android
// (IRISAPPMOVIL: Dojoquestionbank.kt): si cambias uno, cambia el otro.

export interface DojoOption {
  text: string;
  correct: boolean;
  feedback: string;
}

export interface DojoQuestion {
  text: string;
  options: DojoOption[];
}

export type DojoBeltId = 'white' | 'yellow' | 'purple' | 'black';

export const QUESTIONS_PER_ATTEMPT = 5;
export const PASS_SCORE = 70;

export const DOJO_QUESTIONS: Record<DojoBeltId, DojoQuestion[]> = {
  // Cinturón blanco: reconocer señales de control y manipulación
  white: [
    {
      text: 'Tu pareja te escribe: "Si de verdad me quisieras, no saldrías hoy con tus amigos". ¿Qué está haciendo?',
      options: [
        { text: 'Demostrar que le importas mucho', correct: false, feedback: 'Querer a alguien no implica decidir con quién puede estar.' },
        { text: 'Chantaje emocional para aislarte', correct: true, feedback: 'Usa tu cariño como moneda de cambio para alejarte de tu entorno.' },
        { text: 'Pedirte más tiempo juntos de forma sana', correct: false, feedback: 'Pedir tiempo juntos es sano; condicionar el amor a que no veas a nadie, no.' }
      ]
    },
    {
      text: 'Le cuentas algo que te dolió y responde: "Eso nunca pasó, te lo estás inventando, estás loca/o". Si ocurre a menudo, se llama…',
      options: [
        { text: 'Luz de gas (gaslighting)', correct: true, feedback: 'Te hace dudar de tu memoria y tu percepción para que dependas de su versión.' },
        { text: 'Una discusión normal', correct: false, feedback: 'Discrepar es normal; negar sistemáticamente lo que vives para que dudes de ti, no.' },
        { text: 'Sinceridad', correct: false, feedback: 'La sinceridad no busca que dudes de tu propia cabeza.' }
      ]
    },
    {
      text: '¿Cuál de estas situaciones es una señal de alerta?',
      options: [
        { text: 'Te pregunta qué tal te ha ido el día', correct: false, feedback: 'Interesarse por ti es una muestra de cariño sana.' },
        { text: 'Se enfada si no le contestas en cinco minutos', correct: true, feedback: 'Exigir disponibilidad inmediata es una forma de control.' },
        { text: 'Te dice que echa de menos verte', correct: false, feedback: 'Expresar lo que siente sin exigirte nada es sano.' }
      ]
    },
    {
      text: 'Al principio de la relación te llenaba de regalos y mensajes a todas horas; ahora alterna cariño intenso con frialdad y enfados. ¿Qué patrón es?',
      options: [
        { text: 'Así es el amor de verdad', correct: false, feedback: 'El amor sano es estable; no te tiene en una montaña rusa.' },
        { text: 'Refuerzo intermitente: te engancha con cariño y luego lo retira', correct: true, feedback: 'Ese vaivén crea dependencia y hace que intentes "recuperar" la parte buena.' },
        { text: 'Una etapa normal que se pasa sola', correct: false, feedback: 'No suele pasarse solo; conviene hablarlo y pedir apoyo.' }
      ]
    },
    {
      text: '"Los celos son una prueba de amor". ¿Qué opinas?',
      options: [
        { text: 'Es verdad: si no tiene celos, no te quiere', correct: false, feedback: 'Es un mito del amor romántico que justifica el control.' },
        { text: 'Es falso: los celos hablan de inseguridad y posesión, no de amor', correct: true, feedback: 'Sentir celos puntuales es humano, pero usarlos para controlar no es amor.' },
        { text: 'Depende de lo guapa o guapo que seas', correct: false, feedback: 'Nada justifica el control sobre otra persona.' }
      ]
    },
    {
      text: 'Tu pareja critica a tus amistades a todas horas ("son mala influencia", "te quieren separar de mí"). Con el tiempo esto puede provocar…',
      options: [
        { text: 'Que tengas un grupo de amigos más sano', correct: false, feedback: 'Quien decide tus amistades eres tú.' },
        { text: 'Que te quedes sin red de apoyo y dependas solo de esa persona', correct: true, feedback: 'El aislamiento es una de las señales más claras de una relación de control.' },
        { text: 'Que la relación sea más fuerte', correct: false, feedback: 'Una relación sana suma a tu vida social, no la reduce.' }
      ]
    },
    {
      text: '"Te miro el móvil porque no tengo nada que ocultar y tú tampoco deberías". ¿Es razonable?',
      options: [
        { text: 'Sí, en pareja no debe haber secretos', correct: false, feedback: 'Confianza no es vigilancia. Tienes derecho a tu intimidad.' },
        { text: 'No: revisar el móvil de otra persona es control y vulnera su intimidad', correct: true, feedback: 'Además, acceder sin permiso a los mensajes de otra persona puede ser delito.' },
        { text: 'Solo si lo hacéis los dos', correct: false, feedback: 'Que sea recíproco no lo convierte en sano.' }
      ]
    },
    {
      text: 'Hace bromas en público sobre tu cuerpo o tu forma de hablar y dice "es que no aguantas nada". ¿Qué es?',
      options: [
        { text: 'Humor sin importancia', correct: false, feedback: 'Si te hace sentir mal y se repite, no es humor.' },
        { text: 'Menosprecio disfrazado de broma', correct: true, feedback: 'Ridiculizarte va minando tu autoestima, y culparte por molestarte es otra forma de control.' },
        { text: 'Confianza', correct: false, feedback: 'La confianza no se demuestra humillando.' }
      ]
    }
  ],

  // Cinturón amarillo: límites saludables
  yellow: [
    {
      text: 'Tu pareja te pide la contraseña de Instagram "para estar más unidos". ¿Qué opción protege mejor tus límites?',
      options: [
        { text: 'Dársela para evitar una discusión', correct: false, feedback: 'Ceder para evitar conflicto suele traer más peticiones de control.' },
        { text: 'Decir que no con calma: tus cuentas son personales', correct: true, feedback: 'Puedes querer a alguien y mantener tu privacidad digital.' },
        { text: 'Darle una contraseña falsa', correct: false, feedback: 'Engañar no resuelve el problema de fondo: que intenta controlarte.' }
      ]
    },
    {
      text: '¿Qué es un límite personal?',
      options: [
        { text: 'Una forma de castigar a la otra persona', correct: false, feedback: 'Un límite no busca castigar, sino cuidarte.' },
        { text: 'Lo que aceptas y lo que no en tu relación, para cuidar tu bienestar', correct: true, feedback: 'Los límites te protegen y hacen la relación más sana.' },
        { text: 'Algo que solo hay que poner si la relación va mal', correct: false, feedback: 'Los límites son necesarios en todas las relaciones, también en las que van bien.' }
      ]
    },
    {
      text: 'Ya has dicho que no quieres compartir tu ubicación en tiempo real, pero tu pareja insiste cada día. ¿Qué haces?',
      options: [
        { text: 'Acabar compartiéndola para que deje de insistir', correct: false, feedback: 'Cuando un "no" se convierte en "sí" a base de insistir, el límite deja de existir.' },
        { text: 'Mantener el no y decir que la insistencia te hace sentir controlada/o', correct: true, feedback: 'Repetir el límite con calma es una buena estrategia.' },
        { text: 'Dejar de hablarle sin explicar nada', correct: false, feedback: 'Puedes hacerlo si lo necesitas, pero expresar el límite te ayuda a ver cómo reacciona.' }
      ]
    },
    {
      text: 'En una relación sana, si un día no te apetece hacer algo sexual que habíais hecho antes…',
      options: [
        { text: 'Deberías hacerlo igualmente porque ya lo hicisteis', correct: false, feedback: 'El consentimiento se da cada vez y se puede retirar en cualquier momento.' },
        { text: 'Puedes decir que no y tu pareja debe respetarlo sin enfadarse', correct: true, feedback: 'Solo sí es sí: sin un sí libre y claro no hay consentimiento.' },
        { text: 'Tienes que darle una buena razón', correct: false, feedback: 'No necesitas justificarte para decir que no.' }
      ]
    },
    {
      text: 'Tu pareja te pide una foto íntima y te dice que "si me quieres, me la mandas". ¿Qué es lo más acertado?',
      options: [
        { text: 'Mandarla, es una prueba de confianza', correct: false, feedback: 'Presionar para conseguir imágenes íntimas es una forma de violencia.' },
        { text: 'No mandarla: nadie que te respete te presiona con algo así', correct: true, feedback: 'Puedes decir que no. Y difundir imágenes íntimas sin permiso es delito.' },
        { text: 'Mandarla pero sin que se te vea la cara', correct: false, feedback: 'El problema es la presión, no el tipo de foto.' }
      ]
    },
    {
      text: '"No me gusta que vayas con esa ropa, mejor ponte otra cosa". ¿Cómo lo valoras?',
      options: [
        { text: 'Es su opinión, y además te está cuidando', correct: false, feedback: 'Dar una opinión es distinto de decidir cómo vistes.' },
        { text: 'Es una forma de control sobre tu cuerpo y tus decisiones', correct: true, feedback: 'Tu ropa la eliges tú. Si se convierte en norma o en enfado, es control.' },
        { text: 'Es normal en las parejas', correct: false, feedback: 'Que sea frecuente no lo convierte en sano.' }
      ]
    },
    {
      text: 'Pones un límite y tu pareja se enfada muchísimo. ¿Qué te dice eso?',
      options: [
        { text: 'Que el límite estaba mal y debes quitarlo', correct: false, feedback: 'Que alguien se enfade no hace injusto tu límite.' },
        { text: 'Que conviene fijarse en cómo respeta (o no) tus decisiones', correct: true, feedback: 'Cómo reacciona alguien ante un "no" dice mucho de la relación.' },
        { text: 'Que hay que pedir perdón enseguida', correct: false, feedback: 'No tienes que pedir perdón por cuidarte.' }
      ]
    },
    {
      text: '¿Cuál de estas frases es un límite claro?',
      options: [
        { text: '"Bueno, haz lo que quieras…"', correct: false, feedback: 'Es una respuesta pasiva: no dice qué necesitas.' },
        { text: '"No quiero que leas mis mensajes. Si lo vuelves a hacer, me lo voy a replantear."', correct: true, feedback: 'Dice lo que no aceptas y qué harás si se repite.' },
        { text: '"Eres un pesado/a, siempre igual"', correct: false, feedback: 'Atacar no comunica tu límite y suele empeorar la discusión.' }
      ]
    }
  ],

  // Cinturón morado: comunicación asertiva
  purple: [
    {
      text: '¿Qué significa comunicarse de forma asertiva?',
      options: [
        { text: 'Decir lo que piensas y sientes con respeto, sin agredir ni callarte', correct: true, feedback: 'La asertividad está entre la pasividad y la agresividad.' },
        { text: 'Ganar siempre la discusión', correct: false, feedback: 'No se trata de ganar, sino de expresarte y respetar.' },
        { text: 'Evitar los conflictos a toda costa', correct: false, feedback: 'Evitar siempre el conflicto suele significar callar lo que necesitas.' }
      ]
    },
    {
      text: 'Tu pareja te reprocha: "Siempre estás con tus amigas, pasas de mí". ¿Qué respuesta es asertiva?',
      options: [
        { text: '"Vale, perdona, no volveré a quedar con ellas"', correct: false, feedback: 'Respuesta pasiva: renuncias a algo importante para ti.' },
        { text: '"Me importa estar contigo y también ver a mis amigas. Podemos buscar planes juntos, pero no voy a dejar de verlas."', correct: true, feedback: 'Validas lo que siente sin renunciar a tu vida.' },
        { text: '"Pues si no te gusta, ahí tienes la puerta"', correct: false, feedback: 'Respuesta agresiva: escala el conflicto.' }
      ]
    },
    {
      text: '¿Cuál es un mensaje "yo" (que habla de cómo te sientes sin atacar)?',
      options: [
        { text: '"Tú siempre me agobias"', correct: false, feedback: 'Empieza culpando a la otra persona.' },
        { text: '"Me siento agobiada/o cuando me escribes tantas veces seguidas; necesito mi espacio"', correct: true, feedback: 'Describe la situación, cómo te sientes y lo que necesitas.' },
        { text: '"Nadie aguanta lo pesado que eres"', correct: false, feedback: 'Es un ataque, no comunica lo que necesitas.' }
      ]
    },
    {
      text: 'Ante un "Si me dejas, no sé lo que hago", ¿qué es lo más recomendable?',
      options: [
        { text: 'Quedarte en la relación para que no le pase nada', correct: false, feedback: 'No eres responsable de las decisiones de otra persona. Es chantaje emocional.' },
        { text: 'Mantener tu decisión y, si teme por su vida, avisar a alguien adulto o al 112', correct: true, feedback: 'Tomarlo en serio no significa quedarte. Pedir ayuda protege a ambos.' },
        { text: 'Ignorarlo por completo', correct: false, feedback: 'Si hay riesgo real, conviene avisar a una persona adulta o al 112.' }
      ]
    },
    {
      text: 'Una amiga te cuenta que su novio le revisa el móvil y le prohíbe salir. ¿Qué es lo mejor que puedes hacer primero?',
      options: [
        { text: 'Decirle que lo deje ya o dejas de hablarle', correct: false, feedback: 'Presionar puede hacer que se aleje justo de quien la apoya.' },
        { text: 'Escucharla sin juzgar, decirle que no es culpa suya y que estás ahí', correct: true, feedback: 'Sentirse escuchada y no juzgada es el primer paso para que pida ayuda.' },
        { text: 'Hablar tú con su novio para que pare', correct: false, feedback: 'Puede ponerla en más riesgo. Mejor acompañarla y buscar ayuda adulta.' }
      ]
    },
    {
      text: 'Durante una discusión empiezas a sentirte muy nerviosa/o. ¿Qué es asertivo?',
      options: [
        { text: 'Seguir hasta que alguien ceda', correct: false, feedback: 'Discutir en caliente rara vez resuelve nada.' },
        { text: 'Decir "Ahora mismo estoy muy alterada/o, prefiero hablarlo más tarde"', correct: true, feedback: 'Pedir una pausa es una forma sana de cuidarte y cuidar la conversación.' },
        { text: 'Bloquearle en todas las redes sin decir nada', correct: false, feedback: 'Puedes hacerlo si te sientes en peligro, pero en una discusión normal es mejor pedir una pausa.' }
      ]
    },
    {
      text: '¿Cuál de estas respuestas es PASIVA?',
      options: [
        { text: '"No me parece bien y no lo voy a hacer"', correct: false, feedback: 'Es asertiva: clara y respetuosa.' },
        { text: '"Bueno… como tú digas, no pasa nada"', correct: true, feedback: 'Callas lo que piensas para evitar el conflicto.' },
        { text: '"Estás loco si crees que voy a hacer eso"', correct: false, feedback: 'Es agresiva: ataca a la otra persona.' }
      ]
    },
    {
      text: 'Tu pareja te hace sentir culpable: "Después de todo lo que hago por ti…". ¿Cómo responderías de forma asertiva?',
      options: [
        { text: '"Tienes razón, soy lo peor"', correct: false, feedback: 'Aceptas una culpa que no te corresponde.' },
        { text: '"Valoro lo que haces, pero eso no significa que tenga que hacer lo que tú quieras"', correct: true, feedback: 'Reconoces lo bueno sin aceptar el chantaje.' },
        { text: '"Pues yo hago más que tú"', correct: false, feedback: 'Entrar en competición alimenta el conflicto.' }
      ]
    }
  ],

  // Cinturón negro: espacio seguro, recursos y seguridad digital
  black: [
    {
      text: '¿Qué caracteriza al teléfono 016?',
      options: [
        { text: 'Es gratuito, funciona 24 h y no aparece en la factura', correct: true, feedback: 'Conviene borrarlo también del registro de llamadas del móvil. Hay WhatsApp: 600 000 016.' },
        { text: 'Solo atiende a mujeres mayores de edad', correct: false, feedback: 'También atiende a menores, familiares y personas del entorno.' },
        { text: 'Solo sirve para poner denuncias', correct: false, feedback: 'Informa y asesora; no hace falta querer denunciar para llamar.' }
      ]
    },
    {
      text: 'Si estás en peligro inmediato, ¿a qué número debes llamar?',
      options: [
        { text: '016', correct: false, feedback: 'El 016 informa y asesora. En peligro inmediato: 112.' },
        { text: '112', correct: true, feedback: 'El 112 es el número de emergencias. También el 091 (Policía Nacional) o el 062 (Guardia Civil).' },
        { text: '024', correct: false, feedback: 'El 024 es la línea de atención a la conducta suicida.' }
      ]
    },
    {
      text: 'Alguien amenaza con difundir una foto íntima tuya si no le mandas más o le pagas (sextorsión). ¿Qué es lo correcto?',
      options: [
        { text: 'Hacer lo que pide para que no la publique', correct: false, feedback: 'Ceder casi nunca para el chantaje; suele aumentar las exigencias.' },
        { text: 'No ceder, guardar capturas como prueba, contárselo a un adulto y denunciar', correct: true, feedback: 'También puedes llamar al 017 (INCIBE, ciberseguridad) o al 016. No es culpa tuya.' },
        { text: 'Borrar todo y no contárselo a nadie', correct: false, feedback: 'Las pruebas son importantes y no tienes que pasar por esto sola/o.' }
      ]
    },
    {
      text: 'Sospechas que tu ex controla tu ubicación o tus cuentas. ¿Qué medida ayuda?',
      options: [
        { text: 'Cambiar contraseñas, activar la verificación en dos pasos y revisar qué apps comparten tu ubicación', correct: true, feedback: 'Revisa también las sesiones abiertas y los dispositivos vinculados.' },
        { text: 'Publicar en redes que lo sabes', correct: false, feedback: 'Puede ponerte en más riesgo. Mejor protegerte y pedir ayuda.' },
        { text: 'No hacer nada, no se puede evitar', correct: false, feedback: 'Sí se puede: hay medidas sencillas de seguridad digital.' }
      ]
    },
    {
      text: '¿Quién puede ser una persona de confianza a la que acudir en el instituto?',
      options: [
        { text: 'Nadie, es mejor resolverlo sola/o', correct: false, feedback: 'Pedir ayuda no es debilidad: es una forma de protegerte.' },
        { text: 'El departamento de orientación, tu tutor/a o un profesor/a de confianza', correct: true, feedback: 'Saben cómo activar los protocolos y recursos adecuados.' },
        { text: 'Solo la policía', correct: false, feedback: 'La policía es un recurso, pero en el instituto también hay personas preparadas para ayudarte.' }
      ]
    },
    {
      text: 'Una amiga está viviendo violencia en su relación y te pide que no se lo cuentes a nadie. Pero cada vez está peor y tienes miedo por ella. ¿Qué haces?',
      options: [
        { text: 'Guardar el secreto pase lo que pase', correct: false, feedback: 'Cuando hay riesgo, su seguridad está por delante del secreto.' },
        { text: 'Decirle que te preocupa y buscar juntas/os ayuda adulta (orientación, familia, 016)', correct: true, feedback: 'Puedes llamar tú al 016 para pedir consejo sobre cómo ayudarla.' },
        { text: 'Publicarlo en redes para que todo el mundo lo sepa', correct: false, feedback: 'Exponerla puede hacerle daño y ponerla en más peligro.' }
      ]
    },
    {
      text: 'Si alguien sufre violencia de género, ¿necesita denunciar para recibir ayuda?',
      options: [
        { text: 'Sí, sin denuncia no hay ninguna ayuda', correct: false, feedback: 'Hay atención, asesoramiento y apoyo psicológico sin necesidad de denunciar.' },
        { text: 'No: puede recibir información, apoyo y atención aunque no denuncie', correct: true, feedback: 'En Andalucía también puede acudir al Instituto Andaluz de la Mujer (900 200 999).' },
        { text: 'Solo si tiene pruebas físicas', correct: false, feedback: 'La violencia psicológica y digital también es violencia.' }
      ]
    },
    {
      text: '¿Qué es un "plan de seguridad"?',
      options: [
        { text: 'Una lista de pasos para protegerte si te sientes en peligro (a quién llamar, dónde ir, qué llevar)', correct: true, feedback: 'Prepararlo con ayuda profesional (016, orientación) te da más control en un momento difícil.' },
        { text: 'Una app para espiar a tu pareja', correct: false, feedback: 'Espiar no es protegerse y puede ser ilegal.' },
        { text: 'Algo que solo hace la policía', correct: false, feedback: 'Puedes prepararlo tú con apoyo de profesionales.' }
      ]
    }
  ]
};

/** Baraja una copia del array (Fisher-Yates). */
export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Preguntas para un intento: QUESTIONS_PER_ATTEMPT al azar, con las opciones barajadas. */
export function pickDojoQuestions(belt: DojoBeltId): DojoQuestion[] {
  return shuffle(DOJO_QUESTIONS[belt])
    .slice(0, QUESTIONS_PER_ATTEMPT)
    .map((question) => ({ ...question, options: shuffle(question.options) }));
}
