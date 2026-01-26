# Guía para la Presentación del Proyecto IRIS

## 1. Introducción y Concepto

**Título del Proyecto:** IRIS
**Eslogan:** Innovación Social para la Prevención de Violencia de Género
**Misión:** Entrenar a jóvenes en la detección temprana de signos de violencia de género a través de simulaciones interactivas con Inteligencia Artificial.

### El Problema
La "violencia invisible" (control, celos, manipulación psicológica) a menudo pasa desapercibida entre los jóvenes, normalizándose como parte de las relaciones de pareja.

### La Solución IRIS
Una plataforma dual (Web y App Móvil) que utiliza IA para crear un entorno seguro donde los usuarios pueden:
1. Aprender conceptos clave.
2. Practicar situaciones reales mediante roleplay.
3. Recibir retroalimentación inmediata si la conversación se torna tóxica.

---

## 2. Características Clave (Puntos de Venta)

### 🧠 Inteligencia Artificial Avanzada (Gemini)
- **Simulador de Pareja:** El usuario chatea con una IA que simula ser su pareja, mostrando comportamientos sutiles de control o celos para que el usuario aprenda a identificarlos.
- **Modo Guía (Iris):** Una asistente empática que responde dudas sobre violencia de género y ofrece recursos.

### 🛡️ Detección de Seguridad en Tiempo Real
- El sistema analiza cada mensaje en busca de patrones de violencia, manipulación, autolesión o amenazas.
- **Alerta Inmediata:** Si se detecta riesgo, la IA interrumpe el rol para ofrecer ayuda profesional (016, emergencias) y validación emocional.

### 📱 Experiencia Multiplataforma
- **Web:** Enfoque educativo completo, ideal para aulas y presentaciones institucionales.
- **Móvil (Android):** Enfoque privado y personal, optimizado para que los jóvenes lo usen en sus dispositivos.

### 🌍 Inclusividad
- **Bilingüe:** Español e Inglés.
- **Accesible:** Diseño de alto contraste, tema oscuro/claro.

---

## 3. Arquitectura Técnica (Para audiencia técnica)

**Frontend:**
*   **Angular 17:** Uso de *Standalone Components* para modularidad y rendimiento.
*   **Tailwind CSS:** Diseño moderno y totalmente responsive.
*   **Chart.js:** Visualización de datos de impacto.

**Móvil:**
*   **Capacitor 6:** Convierte la web app en una aplicación nativa de Android, manteniendo una única base de código.

**Backend:**
*   **Node.js & Express:** Servidor ligero y eficiente.
*   **Google Geimini API:** Motor de lenguaje natural que impulsa las simulaciones.
*   **Sistema de Prompts:** Ingeniería de prompts compleja para mantener el "personaje" y garantizar la seguridad.

---

## 4. Guía de Demostración (Flow Sugerido)

Sigue estos pasos para una demo efectiva de 5-10 minutos:

1.  **Inicio (Web):**
    *   Muestra la *Hero Section* (Página de inicio).
    *   Navega brevemente por la sección "El Problema" para dar contexto.

2.  **El Chatbot - Modo Iris (Educativo):**
    *   Entra al chat y selecciona el modo "Hablar con Iris".
    *   Pregunta: *"¿Cómo sé si mi relación es tóxica?"*.
    *   Destaca la empatía y claridad de la respuesta.

3.  **El "Efecto WOW" - Modo Simulador (Partner):**
    *   Cambia al "Modo Pareja (Simulación)".
    *   Explica que ahora la IA actuará como una pareja ficticia.
    *   Escribe algo como: *"Voy a salir con mis amigos hoy"*.
    *   Muestra cómo la IA podría responder con celos sutiles (ej: *"¿Ah sí? ¿Y quién va? Espero que no vaya X..."*).
    *   **Punto Clave:** Demuestra cómo esto entrena al usuario para poner límites.

4.  **Detección de Violencia (Seguridad):**
    *   *(Advertencia de contenido)* Escribe una frase que denote control extremo o miedo simulado para activar el filtro de seguridad.
    *   Muestra cómo el sistema "rompe el personaje" para mostrar la **Alerta de Seguridad** y ofrecer ayuda.

5.  **Versión Móvil:**
    *   Si es posible, muestra la app corriendo en un emulador o teléfono Android.
    *   Si no, abre las herramientas de desarrollador del navegador (F12) y pon la vista móvil para mostrar la adaptabilidad.

---

## 5. Recursos Adicionales del Proyecto

En la carpeta del proyecto encontrarás documentación detallada para profundizar:

*   **`README.md`**: Visión general técnica.
*   **`GUIA_EJECUCION.md`**: Pasos para levantar el entorno demo.
*   **`APP_MOVIL.md`**: Detalles específicos de la versión Android.

---

## 6. Estructura de Diapositivas Sugerida (Pitch Deck)

Aquí tienes una propuesta de esquema para tu presentación (PowerPoint / Canva):

### Diapositiva 1: Portada
- Logo de IRIS.
- Título: "IRIS: Innovación Social contra la Violencia de Género".
- Tu nombre / Equipo.
- *Visual: Captura de pantalla atractiva de la app móvil y web.*

### Diapositiva 2: El Contexto (El Problema)
- Dato impactante: % de jóvenes que sufren violencia psicológica sin saberlo.
- El dolor: La dificultad de identificar celos y control como violencia.
- *Visual: Gráfico simple o iconos representativos.*

### Diapositiva 3: Nuestra Propuesta (IRIS)
- ¿Qué es IRIS? Un entorno seguro de entrenamiento.
- Diferencial: Uso de IA para *simular* y *educar* en tiempo real.
- *Visual: Mockup del chat en funcionamiento.*

### Diapositiva 4: ¿Cómo funciona? (Demo)
- Explicación de los dos modos:
    1. **Mentoría (Iris):** Educación.
    2. **Simulación (Pareja):** Práctica.
- *Visual: Diagrama de flujo simple Usuario <-> IA.*

### Diapositiva 5: Tecnología (Under the Hood)
- Logos de tecnologías: Angular, Capacitor, Node.js, Google Gemini.
- Mencionar: Multiplataforma (Web + Android).
- *Visual: Nube de logos tecnológicos.*

### Diapositiva 6: Seguridad y Ética
- Sistema de detección de palabras clave de riesgo.
- Aviso automático y derivación a profesionales (016).
- *Visual: Captura del mensaje de "Alerta de Seguridad".*

### Diapositiva 7: Futuro e Impacto
- Próximos pasos: Más escenarios, soporte a iOS, integración con ONGs.
- Objetivo final: Reducir la tolerancia a la violencia en la juventud.

### Diapositiva 8: Cierre
- Frase final: "La tecnología al servicio de la igualdad".
- Código QR para acceder a la demo / repositorio.
- Datos de contacto.
