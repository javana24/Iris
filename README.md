# Proyecto IRIS - Innovación Social para la Prevención de Violencia de Género

Aplicación web y móvil profesional desarrollada con Angular 17 y Capacitor para presentar el Proyecto IRIS. La aplicación incluye un chatbot con IA (Gemini) para entrenar a jóvenes en la detección temprana de violencia de género.

## 📋 Índice

- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Arquitectura](#-arquitectura)
- [Servicios](#-servicios)
- [Scripts Disponibles](#-scripts-disponibles)
- [Documentación Adicional](#-documentación-adicional)

## 🚀 Características Principales

### Versión Web
- ✅ **Presentación completa** del proyecto con todas las secciones
- ✅ **Chatbot con IA** (Gemini) para simulación de conversaciones
- ✅ **Detección automática** de patrones de violencia en el chat
- ✅ **Gráficos interactivos** con Chart.js
- ✅ **Internacionalización** (ES/EN)
- ✅ **Tema oscuro/claro** con persistencia
- ✅ **Diseño responsive** y moderno

### Versión Android
- ✅ **Versión simplificada** enfocada en el chat y funciones principales
- ✅ **Mismo chatbot con IA** que la versión web
- ✅ **Detección de patrones** de violencia
- ✅ **Navegación optimizada** para móvil
- ✅ **Conexión con servidor local** para desarrollo

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 17** - Framework moderno con standalone components
- **TypeScript** - Tipado estático para mayor robustez
- **Tailwind CSS** - Diseño responsive y moderno
- **Chart.js** - Gráficos interactivos
- **RxJS** - Programación reactiva
- **Angular Animations** - Animaciones fluidas

### Mobile
- **Capacitor 6** - Framework para apps nativas
- **Android Studio** - Desarrollo Android

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **LLM Adapter (Gemini/DeepSeek/OpenAI)** - Proveedor principal + fallback para el chat
- **RAG mínimo sobre dataset local** - Contexto interno para respuestas más precisas
- **CORS** - Configurado para web y móvil

## 📁 Estructura del Proyecto

```
Iris/
├── src/                          # Código fuente Angular
│   ├── app/
│   │   ├── components/           # Componentes de la aplicación
│   │   │   ├── header/          # Navegación principal
│   │   │   ├── footer/           # Pie de página
│   │   │   └── sections/         # Secciones principales
│   │   │       ├── hero-section/         # Sección de inicio
│   │   │       ├── problem-section/      # El problema
│   │   │       ├── solution-section/     # La solución (con chat)
│   │   │       ├── alignment-section/    # Alineación (solo web)
│   │   │       ├── model-section/        # Modelo (solo web)
│   │   │       ├── impact-section/       # Impacto/estadísticas (solo web)
│   │   │       └── contact-section/      # Contacto
│   │   ├── services/            # Servicios Angular
│   │   │   ├── ai.service.ts            # Servicio de IA (chat)
│   │   │   ├── translation.service.ts   # Gestión de idiomas
│   │   │   ├── theme.service.ts         # Gestión de temas
│   │   │   ├── navigation.service.ts    # Gestión de navegación
│   │   │   └── platform.service.ts      # Detección de plataforma
│   │   ├── config/
│   │   │   └── api.config.ts            # Configuración de API
│   │   ├── app.component.ts
│   │   └── app.routes.ts
│   ├── assets/                   # Recursos estáticos
│   ├── styles.scss               # Estilos globales
│   └── index.html
├── server/                        # Servidor backend Node.js
│   ├── server.js                 # Servidor Express
│   ├── package.json
│   └── .env                      # Variables de entorno (crear)
├── android/                       # Proyecto Android (generado por Capacitor)
├── capacitor.config.ts           # Configuración de Capacitor
├── angular.json                  # Configuración de Angular
├── tailwind.config.js            # Configuración de Tailwind
└── package.json                  # Dependencias del proyecto
```

## 📦 Instalación

### Prerrequisitos

- **Node.js 18+** - [Descargar](https://nodejs.org/)
- **npm** - Viene con Node.js
- **Android Studio** - Solo si quieres desarrollar para Android
- **Git** - Para clonar el repositorio

### Pasos de Instalación

1. **Clonar el repositorio** (o descargar el proyecto)
   ```bash
   git clone <url-del-repositorio>
   cd Iris
   ```

2. **Instalar dependencias del frontend**
   ```bash
   npm install
   ```

3. **Instalar dependencias del servidor**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Configurar variables de entorno del servidor**
   ```bash
   cd server
   # Copiar el archivo .env.example a .env (si existe)
   # O crear .env con:
   # GEMINI_API_KEY=tu_api_key_aqui
   # PORT=3001
   # GEMINI_MODEL=gemini-1.5-pro
   ```

## ⚙️ Configuración

### Configuración del Servidor

1. **Crear archivo `.env` en la carpeta `server/`**
   ```env
   GEMINI_API_KEY=tu_api_key_de_google_gemini
   PORT=3001
   GEMINI_MODEL=gemini-1.5-pro
   ```

2. **Configurar proveedores de IA**
   - Copia `server/.env.example` a `server/.env`
   - Configura proveedor principal (`LLM_PROVIDER`) y fallback (`LLM_FALLBACK_PROVIDER`)
   - Añade al menos una API key (`GEMINI_API_KEY`, `DEEPSEEK_API_KEY` o `OPENAI_API_KEY`)

### Configuración para Android

1. **Configurar IP local** (solo para desarrollo móvil)
   - Abre `src/app/config/api.config.ts`
   - Cambia `LOCAL_IP` por la IP de tu ordenador
   - Para obtener tu IP: `ipconfig` (Windows) o `ifconfig` (Linux/Mac)

## 🎯 Ejecución

Para instrucciones detalladas de ejecución, consulta el archivo **[GUIA_EJECUCION.md](./GUIA_EJECUCION.md)**.

### Resumen Rápido

**Web:**
```bash
# Terminal 1: Servidor backend
cd server
node server.js

# Terminal 2: Frontend
npm start
# Abre http://localhost:4200
```

**Android:**
```bash
# 1. Iniciar servidor
cd server
node server.js

# 2. Construir y sincronizar
npm run build:prod
npx cap sync

# 3. Abrir en Android Studio
npx cap open android
```

## 🏗️ Arquitectura

### Frontend (Angular)

La aplicación utiliza una arquitectura modular con:

- **Componentes Standalone**: Cada componente es independiente
- **Servicios**: Lógica de negocio separada
- **Detección de Plataforma**: Versión simplificada para móvil
- **Routing**: Navegación por secciones (scroll)

### Backend (Node.js/Express)

- **API REST**: Endpoint `/api/chat` para el chatbot
- **Fallback de proveedor IA**: Cambio automático al proveedor secundario si el principal falla
- **RAG mínimo**: Recuperación de contexto desde `server/data/rag-dataset.json`
- **Telemetría**: `provider`, `model`, `usage` y `ragHits` por respuesta

### Mobile (Capacitor)

- **WebView**: La app Angular se ejecuta en un WebView nativo
- **Plugins**: Acceso a funcionalidades nativas del dispositivo
- **Network Security**: Configurado para permitir HTTP en desarrollo

## 🔧 Servicios

### `AiService`
Gestiona las peticiones al servidor de IA. Detecta automáticamente si está en móvil o web y usa la URL correcta.

### `TranslationService`
Maneja la internacionalización (ES/EN) con persistencia de preferencias.

### `ThemeService`
Gestiona el tema oscuro/claro con detección automática de preferencias del sistema.

### `NavigationService`
Controla la navegación suave entre secciones y detecta la sección activa.

### `PlatformService`
Detecta si la app está corriendo en móvil nativo o web para mostrar/ocultar secciones.

## 📜 Scripts Disponibles

### Frontend

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor de desarrollo (http://localhost:4200) |
| `npm run build` | Build de desarrollo |
| `npm run build:prod` | Build optimizado para producción |
| `npm test` | Ejecuta tests |
| `npm run watch` | Build en modo watch |

### Capacitor (Mobile)

| Comando | Descripción |
|---------|-------------|
| `npm run cap:sync` | Sincroniza código web con nativo |
| `npm run cap:open:android` | Abre proyecto en Android Studio |
| `npm run cap:build:android` | Build completo para Android (build + sync + open) |

### Servidor

| Comando | Descripción |
|---------|-------------|
| `cd server && npm start` | Inicia el servidor backend (puerto 3001) |
| `cd server && node server.js` | Ejecuta el servidor directamente |

## 📚 Documentación Adicional

- **[GUIA_EJECUCION.md](./GUIA_EJECUCION.md)** - Guía detallada para ejecutar en web y Android
- **[APP_MOVIL.md](./APP_MOVIL.md)** - Guía de aplicación móvil con Capacitor
- **[CONFIGURAR_IP_MOVIL.md](./CONFIGURAR_IP_MOVIL.md)** - Cómo configurar la IP para Android
- **[CONFIGURAR_ANDROID_HTTP.md](./CONFIGURAR_ANDROID_HTTP.md)** - Configurar Android para permitir HTTP
- **[SOLUCION_ANDROID.md](./SOLUCION_ANDROID.md)** - Solución de problemas comunes en Android
- **[docs/project-management/README.md](./docs/project-management/README.md)** - Pack de gestión Scrum/Jira/Confluence/GitHub para la beta

## 🎨 Personalización

### Cambiar Colores
Edita `tailwind.config.js` para modificar la paleta de colores.

### Añadir Traducciones
Edita `src/app/services/translation.service.ts` para añadir nuevos idiomas o textos.

### Modificar Secciones
Cada sección es un componente independiente en `src/app/components/sections/`.

### Configurar Chatbot
El comportamiento del chatbot se configura en `server/server.js` (system prompts).

## 🔒 Seguridad

- ⚠️ **Desarrollo**: La app Android permite HTTP para desarrollo local
- ⚠️ **Producción**: Debes usar HTTPS y configurar certificados SSL
- ⚠️ **API Key**: Nunca subas el archivo `.env` al repositorio (está en `.gitignore`)

## 🐛 Solución de Problemas

### Error de conexión en Android
1. Verifica que el servidor esté corriendo
2. Verifica que la IP en `api.config.ts` sea correcta
3. Verifica que ambos dispositivos estén en la misma WiFi
4. Consulta [SOLUCION_ANDROID.md](./SOLUCION_ANDROID.md)

### Error de CORS
El servidor está configurado para permitir CORS desde cualquier origen. Si persiste, verifica que el servidor esté corriendo.

### Error de API Key
Asegúrate de que el archivo `server/.env` existe y contiene `GEMINI_API_KEY=tu_key`.

## 📝 Notas para la Presentación

### Ventajas de Angular para Instituciones

1. **Profesionalismo**: TypeScript y estructura enterprise
2. **Mantenibilidad**: Código organizado y escalable
3. **Rendimiento**: Optimizaciones automáticas
4. **SEO**: Mejor indexación que SPAs tradicionales
5. **Accesibilidad**: Mejor soporte para a11y
6. **Multiplataforma**: Misma base de código para web y móvil

### Características Destacables

- ✅ Código tipado y robusto (TypeScript)
- ✅ Componentes reutilizables y modulares
- ✅ Servicios separados por responsabilidad
- ✅ Internacionalización completa (ES/EN)
- ✅ Tema adaptable (oscuro/claro)
- ✅ Navegación inteligente
- ✅ Animaciones profesionales
- ✅ Diseño responsive
- ✅ Optimizado para producción
- ✅ Chatbot con IA integrado
- ✅ Detección automática de patrones de violencia
- ✅ Versión móvil optimizada

## 📄 Licencia

Proyecto educativo. Prototipo para la prevención de violencia de género.

---

**Desarrollado con ❤️ para la prevención de violencia de género**

**Proyecto IRIS - Entrenamiento con IA para detectar la violencia invisible**
