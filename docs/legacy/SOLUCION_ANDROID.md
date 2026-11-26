# 🔧 Solución: La IA no funciona en Android

## ⚠️ Problema Principal

La IP en `src/app/config/api.config.ts` está configurada como `'192.168.1.100'` que es solo un **ejemplo**. Debes cambiarla por la **IP real de tu ordenador**.

## ✅ Solución Paso a Paso

### 1️⃣ Obtener tu IP Local

**En PowerShell o CMD:**
```bash
ipconfig
```

Busca la sección de tu adaptador WiFi/Ethernet y encuentra:
```
Dirección IPv4. . . . . . . . . . . . . . . : 192.168.1.50
```

**Ejemplo:** Si tu IP es `192.168.1.50`, esa es la que necesitas.

### 2️⃣ Configurar la IP en el Proyecto

Abre el archivo:
```
src/app/config/api.config.ts
```

Cambia la línea 12:
```typescript
LOCAL_IP: '192.168.1.50', // ⚠️ PON AQUÍ TU IP REAL (no el ejemplo)
```

**Ejemplo completo:**
```typescript
export const API_CONFIG = {
  LOCAL_IP: '192.168.1.50', // ← Tu IP aquí
  PORT: 3001,
  WEB_URL: 'http://localhost:3001',
  get MOBILE_URL(): string {
    return `http://${this.LOCAL_IP}:${this.PORT}`;
  }
};
```

### 3️⃣ Verificar que el Servidor esté Corriendo

En una terminal, ve a la carpeta `server`:
```bash
cd server
node server.js
```

**Deberías ver:**
```
IRIS server running on http://localhost:3001
Also accessible from network: http://192.168.1.50:3001

📱 Para usar en Android, configura la IP: 192.168.1.50
```

⚠️ **IMPORTANTE:** El servidor debe estar corriendo mientras pruebas en Android.

### 4️⃣ Verificar la Red WiFi

- ✅ Tu ordenador y tu móvil Android deben estar en la **misma red WiFi**
- ❌ No funcionará si están en redes diferentes

### 5️⃣ Reconstruir y Probar

```bash
# Reconstruir la app
npm run build:prod

# Sincronizar con Capacitor
npx cap sync

# Abrir Android Studio
npx cap open android
```

En Android Studio:
1. Ejecuta la app en tu dispositivo/emulador
2. Abre **Logcat** (ventana inferior)
3. Busca los logs que empiezan con "📱" o "❌"
4. Verás la URL que está usando y cualquier error

## 🔍 Verificación Rápida

### Checklist:

- [ ] IP configurada en `api.config.ts` (no el ejemplo `192.168.1.100`)
- [ ] Servidor corriendo (`node server.js` en carpeta `server`)
- [ ] Mismo WiFi en ordenador y móvil
- [ ] App reconstruida (`npm run build:prod`)
- [ ] App sincronizada (`npx cap sync`)

### Probar la Conexión Manualmente

En tu móvil Android, abre un navegador y prueba:
```
http://TU_IP:3001/api/health
```

**Ejemplo:** `http://192.168.1.50:3001/api/health`

Si ves `{"ok":true}`, la conexión funciona. Si no, hay un problema de red/firewall.

## 🐛 Troubleshooting

### Error: "No se ha podido responder ahora"

**Causas comunes:**
1. ❌ IP incorrecta en `api.config.ts`
2. ❌ Servidor no está corriendo
3. ❌ Diferentes redes WiFi
4. ❌ Firewall bloqueando el puerto 3001

**Solución:**
1. Verifica la IP con `ipconfig`
2. Actualiza `api.config.ts` con tu IP real
3. Asegúrate de que el servidor esté corriendo
4. Verifica que ambos dispositivos estén en la misma WiFi

### Ver Logs en Android Studio

1. Abre **Logcat** (ventana inferior)
2. Filtra por "IRIS" o busca logs con "📱" o "❌"
3. Verás mensajes como:
   - `📱 Modo móvil detectado`
   - `📍 URL configurada: http://192.168.1.50:3001`
   - `❌ Error en petición HTTP: Status: 0`

### Firewall de Windows

Si el servidor no es accesible desde el móvil:

1. Abre **Firewall de Windows Defender**
2. Permite el puerto 3001 o permite Node.js

O temporalmente desactiva el firewall para probar.

## 📝 Notas Importantes

- La IP puede cambiar si te conectas a otra red WiFi
- Si cambias de red, actualiza la IP en `api.config.ts`
- El servidor debe estar corriendo siempre que uses la app en Android
- En producción, usarías un servidor en la nube, no una IP local

## 🚀 Próximos Pasos

Una vez que funcione:
1. Prueba enviar un mensaje en el chat
2. Verifica que la respuesta de la IA aparezca
3. Revisa los logs en Logcat para confirmar que todo funciona

---

**¿Sigue sin funcionar?** Revisa los logs en Logcat y comparte el error específico que aparece.
