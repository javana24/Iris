# IRIS

Web para trabajar la prevención de la violencia de género con adolescentes. La idea central es un simulador de chat con IA donde se practican conversaciones y se aprende a detectar señales de control que a veces pasan desapercibidas.

Proyecto de FP (CPIFP Alan Turing + IES Ben Gabirol, Málaga). Mención honorífica en los Premios InnoSocial Málaga 2026, categoría Talento Joven.

**Web:** https://irisapp.es

## Qué incluye

- Landing del proyecto (tema claro/oscuro)
- **Consejero IRIS**: chat con IA que orienta sobre relaciones sanas y detecta situaciones de riesgo real
- **Simulador de pareja celosa** con 3 niveles de dificultad, **banderas rojas** que explican cada táctica de control y un **informe final** que evalúa tus respuestas
- **Dojo de Defensa**: 4 cinturones con bancos de preguntas propios
- Cuenta y progreso con Firebase
- Botón de salida rápida (borra el rastro local, cierra sesión y sale a Google)

## Repositorios

| Repo | Qué es |
|---|---|
| [javana24/Iris](https://github.com/javana24/Iris) | Esta web (Angular), desplegada en Vercel |
| [javana24/iris-node](https://github.com/javana24/iris-node) | Backend de IA (Vercel): Ollama en el Spark del instituto + Groq de respaldo |
| [javana24/IRISAPPMOVIL](https://github.com/javana24/IRISAPPMOVIL) | App Android nativa (Kotlin + Compose) |

## Stack

Angular 17 · TypeScript · Tailwind · Firebase · Capacitor

## Arrancar en local

```bash
npm install
npm start          # http://localhost:4200
```

La web usa el backend de producción (`src/environments/environment.ts`). Para usar uno local (`npm run dev` en iris-node), en la consola del navegador:

```js
localStorage.setItem('IRIS_API_BASE_URL', 'http://localhost:3001'); location.reload();
```

Documentación antigua del prototipo en [docs/legacy](docs/legacy).

## Nota

Proyecto educativo / prototipo de innovación social. No es un servicio oficial de emergencias: en situación real, 016 / 112.
