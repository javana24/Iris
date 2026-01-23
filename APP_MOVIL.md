# 📱 Guía de Aplicación Móvil - Proyecto IRIS

Esta guía te explica cómo convertir tu aplicación Angular web en una aplicación móvil nativa usando Capacitor.

## 🚀 Configuración Inicial

### 1. Instalar Dependencias

Primero, instala las dependencias de Capacitor:

```bash
npm install
```

### 2. Inicializar Capacitor (Primera vez)

Si es la primera vez que configuras Capacitor, ejecuta:

```bash
npm run cap:init
```

Esto te pedirá:
- **App name**: `Proyecto IRIS`
- **App ID**: `com.proyectoiris.app` (o el que prefieras)
- **Web dir**: `dist/proyecto-iris`

## 📦 Agregar Plataformas

### Android

```bash
npm run cap:add android
```

### iOS (solo en macOS)

```bash
npm run cap:add ios
```

## 🔨 Build y Sincronización

### 1. Construir la aplicación web

```bash
npm run build:prod
```

### 2. Sincronizar con Capacitor

```bash
npm run cap:sync
```

Este comando:
- Copia los archivos web construidos a las plataformas nativas
- Actualiza las dependencias nativas
- Actualiza los plugins de Capacitor

## 📱 Abrir en IDE Nativo

### Android Studio

```bash
npm run cap:open:android
```

O manualmente:
```bash
npx cap open android
```

### Xcode (solo macOS)

```bash
npm run cap:open:ios
```

O manualmente:
```bash
npx cap open ios
```

## 🚀 Build Completo (Todo en uno)

### Android

```bash
npm run cap:build:android
```

Este comando:
1. Construye la app web
2. Sincroniza con Capacitor
3. Abre Android Studio

### iOS

```bash
npm run cap:build:ios
```

Este comando:
1. Construye la app web
2. Sincroniza con Capacitor
3. Abre Xcode

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run cap:init` | Inicializa Capacitor (solo primera vez) |
| `npm run cap:add` | Agrega una plataforma (android/ios) |
| `npm run cap:sync` | Sincroniza código web con nativo |
| `npm run cap:copy` | Copia solo archivos web |
| `npm run cap:update` | Actualiza dependencias nativas |
| `npm run cap:open:android` | Abre proyecto en Android Studio |
| `npm run cap:open:ios` | Abre proyecto en Xcode |
| `npm run cap:build:android` | Build completo para Android |
| `npm run cap:build:ios` | Build completo para iOS |

## 🔧 Configuración

### Archivo de Configuración

El archivo `capacitor.config.ts` contiene la configuración de la app:

```typescript
{
  appId: 'com.proyectoiris.app',
  appName: 'Proyecto IRIS',
  webDir: 'dist/proyecto-iris',
  // ...
}
```

### Plugins Instalados

- **@capacitor/app**: Funcionalidades básicas de la app
- **@capacitor/haptics**: Vibración háptica
- **@capacitor/keyboard**: Control del teclado
- **@capacitor/status-bar**: Control de la barra de estado

## 📱 Desarrollo

### Modo Desarrollo

1. Construye la app:
```bash
npm run build:prod
```

2. Sincroniza:
```bash
npm run cap:sync
```

3. Abre en el IDE nativo:
```bash
npm run cap:open:android
# o
npm run cap:open:ios
```

4. Ejecuta desde Android Studio o Xcode

### Live Reload (Opcional)

Para desarrollo con recarga automática, puedes usar:

```bash
npm start
```

Y en `capacitor.config.ts` cambiar:
```typescript
server: {
  url: 'http://localhost:4200',
  cleartext: true
}
```

## 🏗️ Estructura del Proyecto

Después de agregar plataformas, verás:

```
Iris/
├── android/          # Proyecto Android nativo
├── ios/              # Proyecto iOS nativo (solo macOS)
├── dist/             # Build de la app web
├── capacitor.config.ts
└── ...
```

## ⚠️ Notas Importantes

1. **Android**: Necesitas Android Studio instalado
2. **iOS**: Solo funciona en macOS con Xcode instalado
3. **Build**: Siempre ejecuta `npm run build:prod` antes de `cap:sync`
4. **Git**: Las carpetas `android/` e `ios/` se agregan al `.gitignore` automáticamente

## 🐛 Solución de Problemas

### Error: "Cannot find module '@capacitor/core'"

```bash
npm install
```

### Error: "Web dir does not exist"

Asegúrate de construir la app primero:
```bash
npm run build:prod
```

### La app no se actualiza

1. Reconstruye: `npm run build:prod`
2. Sincroniza: `npm run cap:sync`
3. Limpia y reconstruye en Android Studio/Xcode

## 📚 Recursos

- [Documentación de Capacitor](https://capacitorjs.com/docs)
- [Guía de Android](https://capacitorjs.com/docs/android)
- [Guía de iOS](https://capacitorjs.com/docs/ios)

---

**¡Tu aplicación Angular ahora es una app móvil nativa! 🎉**
