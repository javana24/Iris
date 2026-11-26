# ✅ Solución Rápida: Error de Conexión en Android

## 🔍 Problema

La app muestra: "No he podido responder ahora. Intenta de nuevo en unos segundos. (URL: http://192.168.0.43:3001)"

## ✅ Solución (3 Pasos)

### 1️⃣ Verificar que el Servidor esté Corriendo

Abre una terminal y ejecuta:

```bash
cd server
node server.js
```

**Debes ver:**
```
IRIS server running on http://localhost:3001
Also accessible from network: http://192.168.0.43:3001
```

⚠️ **IMPORTANTE:** Deja esta terminal abierta mientras pruebas en Android.

### 2️⃣ Reconstruir la App

En otra terminal:

```bash
npm run build:prod
npx cap sync
```

### 3️⃣ Reconstruir en Android Studio

```bash
npx cap open android
```

En Android Studio:
1. **Build** → **Clean Project**
2. **Build** → **Rebuild Project**
3. Ejecuta la app en tu dispositivo

## ✅ Cambios Realizados

He configurado automáticamente:

1. ✅ **AndroidManifest.xml** - Permite conexiones HTTP
2. ✅ **network_security_config.xml** - Configuración de seguridad de red
3. ✅ **capacitor.config.ts** - Cambiado a `http` en lugar de `https`

## 🔍 Verificación

### Probar en el Navegador del Móvil

En tu móvil Android, abre Chrome y prueba:
```
http://192.168.0.43:3001/api/health
```

**Deberías ver:** `{"ok":true}`

Si ves esto, la conexión funciona. Si no:
- ✅ Verifica que el servidor esté corriendo
- ✅ Verifica que ambos dispositivos estén en la misma WiFi
- ✅ Verifica la IP con `ipconfig` y actualiza `api.config.ts` si cambió

## 📝 Checklist Final

- [ ] Servidor corriendo (`node server.js` en carpeta `server`)
- [ ] App reconstruida (`npm run build:prod && npx cap sync`)
- [ ] Android Studio: Clean y Rebuild
- [ ] Mismo WiFi en ordenador y móvil
- [ ] IP correcta en `api.config.ts` (192.168.0.43)

---

**¿Sigue sin funcionar?** Revisa los logs en Logcat (Android Studio) buscando "📱" o "❌".
