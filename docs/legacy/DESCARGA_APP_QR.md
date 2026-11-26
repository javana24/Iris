# Descargar la app Android por QR (para la exposición)

Es **totalmente factible** para mañana. Resumen: generas el APK, lo subes a una URL pública y creas un QR que apunte a esa URL. Quien escanee el QR puede descargar e instalar la app.

---

## 1. Generar el APK (esta noche o mañana temprano)

### Opción A – Android Studio (recomendada)

1. Build de la web y sync:
   ```bash
   npm run build:prod
   npx cap sync
   ```
2. Abre el proyecto Android:
   ```bash
   npx cap open android
   ```
3. En Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
4. Cuando termine, Android Studio suele ofrecer **“locate”**. El APK está en:
   ```text
   android/app/build/outputs/apk/debug/app-debug.apk
   ```
5. Copia `app-debug.apk` a una carpeta que recuerdes (por ejemplo `release/`) y, si quieres, renómbralo a `Iris.apk`.

### Opción B – Línea de comandos (si tienes SDK y Gradle)

Desde la raíz del proyecto:

```bash
npm run build:prod && npx cap sync
cd android
./gradlew assembleDebug
```

El APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`.

---

## 2. Poner el APK en una URL (elige una)

### Opción 1 – GitHub Release (muy buena si el proyecto está en GitHub)

1. En tu repositorio: **Releases → Create a new release**.
2. Tag, por ejemplo: `v1.0-expo`.
3. Sube el archivo `app-debug.apk` (o `Iris.apk`).
4. Publica el release.
5. Clic derecho en el APK en la lista de assets → **Copy link address**.
   - La URL será algo como:  
     `https://github.com/TU_USUARIO/Iris/releases/download/v1.0-expo/app-debug.apk`

Usa **esta URL** como enlace de descarga** para el QR.

### Opción 2 – Servidor local (misma Wi‑Fi que la exposición)

Si en la exposición usas un portátil con el backend de IRIS y todos están en la misma Wi‑Fi:

1. Copia el APK a la carpeta del servidor, por ejemplo:
   ```text
   server/Iris.apk
   ```
2. En `server/server.js` añade **antes** de `app.listen`:
   ```js
   const path = require('path');
   app.get('/app.apk', (_req, res) => {
     res.download(path.join(__dirname, 'Iris.apk'), 'Iris.apk');
   });
   ```
3. Arranca el servidor y averigua la IP del portátil (el propio servidor suele imprimirla en consola).
4. La URL de descarga será:  
   `http://TU_IP:3001/app.apk`  
   (sustituye `TU_IP` por la IP que veas).

Solo funcionará para dispositivos en esa misma red.

### Opción 3 – Google Drive / Dropbox

1. Sube el APK a Drive o Dropbox.
2. Genera un **enlace de descarga directa**:
   - **Drive**: Abrir con → Obtener enlace → “Cualquier persona con el enlace” → Copiar enlace.  
     Para que sea descarga directa suele usarse un conversor o “[Drive direct link](https://sites.google.com/site/gdocs2direct/)”.  
   - **Dropbox**: Compartir → Copiar enlace y en la URL cambia `www.dropbox.com` por `dl.dropboxusercontent.com` y quita `?dl=0` o pon `?dl=1`.

Usa esa URL final como enlace del QR.

---

## 3. Crear el QR que apunte a la descarga

Tienes que generar un QR cuya “dato” sea **exactamente la URL de descarga** del APK (la que obtuviste en el paso 2).

### Opción rápida – Página incluida en el proyecto

En la raíz del proyecto hay un `descarga-app.html`. Ábrelo en el navegador pasándole la URL del APK:

```text
descarga-app.html?url=URL_COMPLETA_DEL_APK
```

Ejemplo si usas el servidor local:

```text
file:///C:/.../Iris/descarga-app.html?url=http://192.168.1.100:3001/app.apk
```

(O abre `descarga-app.html` y edita dentro de la misma página el campo “URL de descarga” si lo dejamos con un input.)

Esa página muestra un QR actualizado y un texto tipo “Escanea para descargar la app”. Puedes dejarla abierta en un portátil/tablet durante la exposición.

### Opción alternativa – Generador externo

- [QR Code Generator](https://www.qr-code-generator.com/) o [goqr.me](https://goqr.me/)
- En “Contenido” o “URL” pega la URL de descarga del APK.
- Genera y descarga la imagen del QR.
- Imprímela o muéstrala en pantalla en la exposición.

---

## 4. Durante la exposición

- Pon el QR visible (pantalla o cartel).
- Explica: “Escanead el QR con la cámara o una app de QR para descargar la app IRIS”.
- En Android, al abrir el enlace se descargará el APK; después hay que abrirlo e instalar ( puede pedir “Permitir esta fuente” si no es Play Store).

---

## Resumen “para mañana”

| Paso | Tiempo orientativo |
|------|--------------------|
| 1. Build + generar APK en Android Studio | 5–15 min |
| 2. Subir APK (GitHub Release o servidor local) y copiar URL | 5 min |
| 3. Abrir `descarga-app.html?url=...` o generar QR en web | 2 min |

Si ya tienes el proyecto Android abierto en Android Studio y el build sin errores, en menos de media hora puedes tener el QR listo para la exposición.
