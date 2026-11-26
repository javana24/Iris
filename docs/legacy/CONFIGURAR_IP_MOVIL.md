# 📱 Configuración de IP para Android

Para que la IA funcione en Android, necesitas configurar la IP de tu ordenador.

## 🔍 Paso 1: Obtener tu IP Local

### En Windows:
```bash
ipconfig
```

Busca **"Dirección IPv4"** en la sección de tu adaptador de red (WiFi o Ethernet).

Ejemplo: `192.168.1.100`

### En macOS/Linux:
```bash
ifconfig
# o
ip addr
```

## ⚙️ Paso 2: Configurar la IP en el Proyecto

1. Abre el archivo: `src/app/config/api.config.ts`

2. Cambia la línea 12:
   ```typescript
   LOCAL_IP: 'TU_IP_AQUI', // Ejemplo: '192.168.1.100'
   ```

3. Reemplaza `'192.168.1.100'` por tu IP real.

## 🔄 Paso 3: Reconstruir y Sincronizar

```bash
# 1. Construir la app
npm run build:prod

# 2. Sincronizar con Android
npx cap sync

# 3. Abrir en Android Studio
npx cap open android
```

## ✅ Verificación

1. **Asegúrate de que el servidor esté corriendo**:
   ```bash
   cd server
   node server.js
   ```

2. **Verifica que ambos dispositivos estén en la misma red WiFi**

3. **Prueba la conexión desde el móvil**:
   - Abre la app en Android
   - Intenta usar el chat
   - Debería funcionar si la IP está correcta

## 🐛 Solución de Problemas

### La app no se conecta:
- ✅ Verifica que el servidor esté corriendo
- ✅ Verifica que la IP sea correcta
- ✅ Verifica que ambos dispositivos estén en la misma WiFi
- ✅ Verifica que el firewall de Windows no bloquee el puerto 3001

### Error de CORS:
- El servidor ya está configurado para permitir CORS desde cualquier origen
- Si persiste, reinicia el servidor

## 📝 Nota

La IP puede cambiar si te conectas a otra red WiFi. Si cambia, actualiza `api.config.ts` y vuelve a sincronizar.
