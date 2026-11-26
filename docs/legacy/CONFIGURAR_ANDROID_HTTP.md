# 🔧 Configurar Android para Permitir HTTP

## ⚠️ Problema

Android bloquea conexiones HTTP por defecto desde Android 9 (API 28) en adelante. Necesitas configurar la seguridad de red para permitir conexiones HTTP a tu servidor local.

## ✅ Solución Paso a Paso

### 1️⃣ Verificar que el Servidor esté Corriendo

En una terminal, ve a la carpeta `server` y ejecuta:

```bash
cd server
node server.js
```

**Deberías ver:**
```
IRIS server running on http://localhost:3001
Also accessible from network: http://192.168.0.43:3001

📱 Para usar en Android, configura la IP: 192.168.0.43
```

⚠️ **IMPORTANTE:** El servidor debe estar corriendo mientras pruebas en Android.

### 2️⃣ Reconstruir y Sincronizar

```bash
npm run build:prod
npx cap sync
```

### 3️⃣ Configurar AndroidManifest.xml

Abre Android Studio:
```bash
npx cap open android
```

En Android Studio:

1. Ve a: `android/app/src/main/AndroidManifest.xml`
2. Busca la etiqueta `<application>` 
3. Añade esta línea dentro de `<application>`:

```xml
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

**Ejemplo completo:**
```xml
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config"
    android:label="@string/app_name"
    android:icon="@mipmap/ic_launcher">
    ...
</application>
```

### 4️⃣ Crear network_security_config.xml

1. En Android Studio, ve a: `android/app/src/main/res/`
2. Si no existe, crea la carpeta `xml/`
3. Crea el archivo `network_security_config.xml` con este contenido:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Permitir conexiones HTTP a IPs locales para desarrollo -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
        <!-- Permitir todas las IPs locales (192.168.x.x, 10.x.x.x, etc.) -->
        <domain includeSubdomains="true">192.168.0.0</domain>
        <domain includeSubdomains="true">192.168.1.0</domain>
        <domain includeSubdomains="true">192.168.2.0</domain>
        <domain includeSubdomains="true">10.0.0.0</domain>
        <domain includeSubdomains="true">172.16.0.0</domain>
    </domain-config>
    
    <!-- Permitir HTTP para desarrollo local -->
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
</network-security-config>
```

### 5️⃣ Verificar la IP en api.config.ts

Asegúrate de que la IP en `src/app/config/api.config.ts` sea correcta:

```typescript
LOCAL_IP: '192.168.0.43', // ← Tu IP real
```

### 6️⃣ Reconstruir la App

En Android Studio:
1. **Build** → **Clean Project**
2. **Build** → **Rebuild Project**
3. Ejecuta la app en tu dispositivo

## 🔍 Verificación

### Probar la Conexión Manualmente

En tu móvil Android, abre un navegador (Chrome) y prueba:
```
http://192.168.0.43:3001/api/health
```

**Deberías ver:** `{"ok":true}`

Si ves esto, la conexión funciona. Si no, verifica:
- ✅ Servidor corriendo
- ✅ Mismo WiFi en ordenador y móvil
- ✅ IP correcta en `api.config.ts`
- ✅ AndroidManifest.xml configurado
- ✅ network_security_config.xml creado

## 🐛 Troubleshooting

### Error: "Cleartext HTTP traffic not permitted"

**Solución:** Asegúrate de que:
1. `android:usesCleartextTraffic="true"` está en AndroidManifest.xml
2. `network_security_config.xml` existe y está bien configurado
3. Has hecho **Clean** y **Rebuild** en Android Studio

### La app sigue sin conectar

1. **Verifica el servidor:**
   ```bash
   cd server
   node server.js
   ```

2. **Verifica la IP:**
   ```bash
   ipconfig
   ```
   Asegúrate de que la IP en `api.config.ts` coincida.

3. **Verifica la red:**
   - Ordenador y móvil en la misma WiFi
   - Firewall de Windows permitiendo el puerto 3001

4. **Revisa Logcat en Android Studio:**
   - Busca logs con "📱" o "❌"
   - Verás la URL que está usando y cualquier error

## 📝 Notas Importantes

- ⚠️ `usesCleartextTraffic="true"` solo debe usarse en desarrollo
- ⚠️ En producción, usa HTTPS
- ⚠️ La IP puede cambiar si cambias de red WiFi
- ⚠️ El servidor debe estar corriendo siempre que uses la app

---

**¿Sigue sin funcionar?** Revisa los logs en Logcat y comparte el error específico.
