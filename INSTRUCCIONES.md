# 📋 Instrucciones de Uso - Proyecto IRIS Angular

## 🚀 Inicio Rápido

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Instalar Angular CLI (si no lo tienes)
```bash
npm install -g @angular/cli
```

### 3. Iniciar Servidor de Desarrollo
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

## 📝 Completar las Secciones

He creado la estructura base con componentes stub. Para completar cada sección:

### Opción 1: Copiar desde HTML Original
1. Abre `index.html` (el original)
2. Copia el contenido HTML de cada sección
3. Pégalo en el componente correspondiente en `src/app/components/sections/[nombre-seccion]/[nombre-seccion].component.html`

### Opción 2: Usar el Patrón de Hero
El componente `hero-section` está completo y puede servir como referencia para las demás secciones.

## 🔧 Componentes a Completar

1. ✅ **hero-section** - COMPLETO (usar como referencia)
2. ⚠️ **problem-section** - Necesita HTML completo
3. ⚠️ **solution-section** - Necesita HTML completo  
4. ⚠️ **alignment-section** - Necesita HTML completo
5. ⚠️ **model-section** - Tiene gráficos, necesita resto del HTML
6. ⚠️ **impact-section** - Tiene gráficos, necesita KPIs y resto
7. ⚠️ **contact-section** - Necesita HTML completo

## 🎨 Personalización

### Cambiar Textos
Edita: `src/app/services/translation.service.ts`

### Cambiar Colores
Edita: `tailwind.config.js`

### Añadir Animaciones
Usa Angular Animations en los componentes:
```typescript
import { trigger, transition, style, animate } from '@angular/animations';
```

## 📦 Build para Producción

```bash
npm run build:prod
```

Los archivos estarán en `dist/proyecto-iris/`

## ⚠️ Notas Importantes

1. **Tailwind CSS**: Asegúrate de tenerlo instalado:
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init
   ```

2. **ng2-charts**: Ya está en las dependencias, pero si hay problemas:
   ```bash
   npm install ng2-charts chart.js --save
   ```

3. **TypeScript**: Si hay errores de tipos, verifica que todas las importaciones estén correctas.

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "ng2-charts not found"
```bash
npm install ng2-charts chart.js --save
```

### Error: Tailwind no funciona
Verifica que `tailwind.config.js` tenga el contenido correcto y que `styles.scss` importe Tailwind.

## 📚 Recursos

- [Angular Docs](https://angular.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [ng2-charts](https://valor-software.com/ng2-charts/)

---

**¡Listo para impresionar a la Junta de Andalucía! 🚀**
