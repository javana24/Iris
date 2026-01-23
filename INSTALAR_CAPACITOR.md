# 🔧 Instalación de Capacitor

## ⚠️ Error Resuelto

El error `TS2307: Cannot find module '@capacitor/core'` se ha resuelto eliminando el import innecesario de `main.ts`.

## 📦 Instalación de Dependencias

Para instalar Capacitor y todas sus dependencias, ejecuta:

```bash
npm install
```

Si tienes problemas con el caché de npm, intenta:

```bash
npm cache clean --force
npm install
```

## ✅ Verificación

Después de instalar, verifica que las dependencias estén instaladas:

```bash
npm list @capacitor/core
```

Deberías ver algo como:
```
@capacitor/core@6.0.0
```

## 🚀 Próximos Pasos

Una vez instaladas las dependencias:

1. **Construir la app**:
   ```bash
   npm run build:prod
   ```

2. **Inicializar Capacitor** (solo primera vez):
   ```bash
   npx cap init
   ```

3. **Agregar plataforma Android**:
   ```bash
   npx cap add android
   ```

4. **Sincronizar**:
   ```bash
   npx cap sync
   ```

## 🐛 Si el Error Persiste

Si después de instalar las dependencias el error persiste:

1. Cierra y vuelve a abrir tu IDE (VS Code, etc.)
2. Reinicia el servidor de TypeScript: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. Verifica que `node_modules/@capacitor/core` existe

---

**Nota**: El import de Capacitor en `main.ts` es opcional. Capacitor se inicializa automáticamente cuando está instalado.
