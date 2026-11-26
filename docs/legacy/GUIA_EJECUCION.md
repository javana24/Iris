# 🚀 Guía de Ejecución - Proyecto IRIS

Esta guía explica paso a paso cómo ejecutar el Proyecto IRIS en **Web** y **Android**.

## 📋 Tabla de Contenidos

- [Ejecución en Web](#-ejecución-en-web)
- [Ejecución en Android](#-ejecución-en-android)
- [Requisitos Previos](#-requisitos-previos)
- [Solución de Problemas](#-solución-de-problemas)

---

## 🌐 Ejecución en Web

### Paso 1: Instalar Dependencias

Si es la primera vez que ejecutas el proyecto:

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del servidor
cd server
npm install
cd ..
```

### Paso 2: Configurar el Servidor

1. **Crear archivo `.env` en la carpeta `server/`**

   ```bash
   cd server
   ```

2. **Crear el archivo `.env` con este contenido:**

   ```env
   GEMINI_API_KEY=tu_api_key_de_google_gemini
   PORT=3001
   GEMINI_MODEL=gemini-1.5-pro
   ```

3. **Obtener API Key de Gemini:**
   - Ve a [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Crea una nueva API key
   - Cópiala en el archivo `.env`

### Paso 3: Iniciar el Servidor Backend

Abre una terminal y ejecuta:

```bash
cd server
node server.js
```

**Deberías ver:**
```
IRIS server running on http://localhost:3001
Also accessible from network: http://TU_IP:3001
```

⚠️ **IMPORTANTE:** Deja esta terminal abierta mientras usas la aplicación.

### Paso 4: Iniciar el Frontend

Abre **otra terminal** (deja la del servidor corriendo) y ejecuta:

```bash
npm start
```

O si prefieres:

```bash
ng serve
```

**Deberías ver:**
```
✔ Browser application bundle generation complete.
✔ Compiled successfully.

** Angular Live Development Server is listening on localhost:4200 **
```

### Paso 5: Abrir en el Navegador

Abre tu navegador y ve a:
```
http://localhost:4200
```

¡La aplicación debería estar funcionando! 🎉

### Resumen de Comandos para Web

```bash
# Terminal 1: Servidor
cd server
node server.js

# Terminal 2: Frontend
npm start
# Abre http://localhost:4200
```

---

## 📱 Ejecución en Android

### Requisitos Previos

- ✅ Node.js instalado
- ✅ Android Studio instalado
- ✅ Proyecto Android configurado (ejecutar `npx cap sync` al menos una vez)
- ✅ Dispositivo Android o emulador configurado

### Paso 1: Configurar la IP Local

1. **Obtener tu IP local:**

   **Windows:**
   ```bash
   ipconfig
   ```
   Busca "Dirección IPv4" (ejemplo: `192.168.1.50`)

   **Linux/Mac:**
   ```bash
   ifconfig
   # o
   ip addr show
   ```

2. **Configurar la IP en el proyecto:**

   Abre `src/app/config/api.config.ts` y cambia:

   ```typescript
   LOCAL_IP: 'TU_IP_AQUI', // Ejemplo: '192.168.1.50'
   ```

### Paso 2: Configurar Android para HTTP

El proyecto ya está configurado, pero verifica:

1. **AndroidManifest.xml** debe tener:
   ```xml
   android:usesCleartextTraffic="true"
   android:networkSecurityConfig="@xml/network_security_config"
   ```

2. **network_security_config.xml** debe existir en:
   `android/app/src/main/res/xml/network_security_config.xml`

   (Estos archivos ya están configurados en el proyecto)

### Paso 3: Iniciar el Servidor Backend

**IMPORTANTE:** El servidor debe estar corriendo para que la app móvil funcione.

```bash
cd server
node server.js
```

**Deberías ver:**
```
IRIS server running on http://localhost:3001
Also accessible from network: http://TU_IP:3001

📱 Para usar en Android, configura la IP: TU_IP
```

⚠️ **Deja esta terminal abierta** mientras pruebas en Android.

### Paso 4: Verificar la Conexión

**En tu móvil Android** (conectado a la misma WiFi):

1. Abre Chrome
2. Ve a: `http://TU_IP:3001/api/health`
   - Ejemplo: `http://192.168.1.50:3001/api/health`

**Deberías ver:** `{"ok":true}`

Si ves esto, la conexión funciona. Si no, verifica:
- ✅ Servidor corriendo
- ✅ Mismo WiFi en ordenador y móvil
- ✅ IP correcta en `api.config.ts`

### Paso 5: Construir la Aplicación

```bash
# Construir la app para producción
npm run build:prod

# Sincronizar con Capacitor
npx cap sync
```

### Paso 6: Abrir en Android Studio

```bash
npx cap open android
```

O usa el comando todo-en-uno:

```bash
npm run cap:build:android
```

Este comando hace: build → sync → abrir Android Studio

### Paso 7: Ejecutar en Android Studio

1. **Espera a que Android Studio cargue** el proyecto
2. **Selecciona tu dispositivo** o emulador en la barra superior
3. **Haz clic en "Run"** (▶️) o presiona `Shift + F10`

La app se instalará y ejecutará en tu dispositivo/emulador.

### Resumen de Comandos para Android

```bash
# 1. Configurar IP en src/app/config/api.config.ts

# 2. Iniciar servidor (Terminal 1)
cd server
node server.js

# 3. Construir y sincronizar (Terminal 2)
npm run build:prod
npx cap sync

# 4. Abrir en Android Studio
npx cap open android

# 5. En Android Studio: Run (▶️)
```

---

## ✅ Requisitos Previos

### Para Web

- ✅ Node.js 18+
- ✅ npm
- ✅ Navegador moderno (Chrome, Firefox, Edge, Safari)

### Para Android

- ✅ Todo lo anterior
- ✅ Android Studio instalado
- ✅ Android SDK configurado
- ✅ Dispositivo Android o emulador
- ✅ Ordenador y móvil en la misma red WiFi (para desarrollo)

---

## 🔄 Flujo de Trabajo de Desarrollo

### Desarrollo Web

1. **Iniciar servidor** (una vez)
   ```bash
   cd server
   node server.js
   ```

2. **Iniciar frontend** (en otra terminal)
   ```bash
   npm start
   ```

3. **Hacer cambios** en el código
   - El frontend se recarga automáticamente
   - Si cambias el servidor, reinícialo

### Desarrollo Android

1. **Iniciar servidor** (siempre debe estar corriendo)
   ```bash
   cd server
   node server.js
   ```

2. **Hacer cambios** en el código Angular

3. **Reconstruir y sincronizar**
   ```bash
   npm run build:prod
   npx cap sync
   ```

4. **En Android Studio:**
   - **Build** → **Clean Project**
   - **Build** → **Rebuild Project**
   - Ejecutar la app

---

## 🐛 Solución de Problemas

### Problema: "No se ha podido responder ahora" en Android

**Causas comunes:**
1. ❌ Servidor no está corriendo
2. ❌ IP incorrecta en `api.config.ts`
3. ❌ Diferentes redes WiFi
4. ❌ Firewall bloqueando el puerto 3001

**Solución:**
1. Verifica que el servidor esté corriendo (`node server.js`)
2. Verifica la IP con `ipconfig` y actualiza `api.config.ts`
3. Asegúrate de que ambos dispositivos estén en la misma WiFi
4. Verifica el firewall de Windows

### Problema: Error de CORS

El servidor ya está configurado para permitir CORS. Si persiste:
- Verifica que el servidor esté corriendo
- Verifica que uses la URL correcta

### Problema: "Cannot find module '@capacitor/core'"

```bash
npm install
```

### Problema: La app no se actualiza en Android

1. Reconstruye:
   ```bash
   npm run build:prod
   npx cap sync
   ```

2. En Android Studio:
   - **Build** → **Clean Project**
   - **Build** → **Rebuild Project**

### Problema: Error de conexión HTTP en Android

Verifica que:
- ✅ `AndroidManifest.xml` tiene `usesCleartextTraffic="true"`
- ✅ `network_security_config.xml` existe
- ✅ Has hecho Clean y Rebuild en Android Studio

### Problema: API Key no funciona

1. Verifica que el archivo `server/.env` existe
2. Verifica que contiene `GEMINI_API_KEY=tu_key`
3. Verifica que la key es válida en [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Reinicia el servidor después de cambiar `.env`

---

## 📝 Notas Importantes

### Para Desarrollo

- ⚠️ El servidor debe estar corriendo siempre que uses la app
- ⚠️ En Android, usa la IP local, no `localhost`
- ⚠️ Ambos dispositivos deben estar en la misma WiFi

### Para Producción

- ⚠️ Usa HTTPS, no HTTP
- ⚠️ Configura un servidor en la nube (no IP local)
- ⚠️ Actualiza `api.config.ts` con la URL del servidor de producción
- ⚠️ Configura certificados SSL

### Cambios de Red

Si cambias de red WiFi:
1. Obtén tu nueva IP (`ipconfig`)
2. Actualiza `src/app/config/api.config.ts`
3. Reconstruye la app (`npm run build:prod && npx cap sync`)

---

## 🎯 Checklist de Verificación

### Para Web

- [ ] Dependencias instaladas (`npm install` en raíz y `server/`)
- [ ] Archivo `server/.env` creado con `GEMINI_API_KEY`
- [ ] Servidor corriendo (`node server.js` en carpeta `server`)
- [ ] Frontend corriendo (`npm start`)
- [ ] Navegador abierto en `http://localhost:4200`
- [ ] Chat funciona correctamente

### Para Android

- [ ] IP configurada en `api.config.ts`
- [ ] Servidor corriendo (`node server.js`)
- [ ] App construida (`npm run build:prod`)
- [ ] App sincronizada (`npx cap sync`)
- [ ] Android Studio abierto
- [ ] Dispositivo/emulador conectado
- [ ] App instalada y ejecutándose
- [ ] Chat funciona correctamente

---

## 📚 Documentación Adicional

- **[README.md](./README.md)** - Documentación completa del proyecto
- **[APP_MOVIL.md](./APP_MOVIL.md)** - Guía detallada de Capacitor
- **[CONFIGURAR_IP_MOVIL.md](./CONFIGURAR_IP_MOVIL.md)** - Cómo obtener y configurar la IP
- **[CONFIGURAR_ANDROID_HTTP.md](./CONFIGURAR_ANDROID_HTTP.md)** - Configurar HTTP en Android
- **[SOLUCION_ANDROID.md](./SOLUCION_ANDROID.md)** - Solución de problemas en Android

---

**¿Necesitas ayuda?** Revisa la documentación adicional o los logs en la consola/Logcat.
