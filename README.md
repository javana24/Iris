# IRIS

Web (y base móvil) para trabajar la prevención de violencia de género con adolescentes. La idea central es un simulador de chat con IA donde se practican conversaciones y se aprende a pillar señales que a veces pasan desapercibidas.

Proyecto de FP (CPIFP Alan Turing + IES Ben Gabirol). Mención honorífica en los Premios InnoSocial Málaga 2026, categoría Talento Joven.

**Demo:** https://proyecto-iris-lyart.vercel.app

## Qué incluye

- Landing del proyecto (ES/EN, tema claro/oscuro)
- Simulador de chat con IA (Gemini / Ollama)
- Backend Node en `/server`
- Auth y perfil con Firebase
- Empaquetado con Capacitor (Android)

Hay también una app nativa en Kotlin (Compose) en otro repo del equipo.

## Stack

Angular 17 · TypeScript · Tailwind · Node/Express · Firebase · Gemini/Ollama · Capacitor

## Arrancar en local

```bash
npm install
cd server && npm install && cd ..
```

En `server/` copia `.env.example` a `.env` y pon tu `GEMINI_API_KEY` (o configura Ollama).

```bash
# terminal 1
cd server && npm start

# terminal 2
npm start
```

Abre http://localhost:4200

Más detalle en `GUIA_EJECUCION.md` y en `server/README.md`.

## Nota

Proyecto educativo / prototipo de innovación social. No es un servicio oficial de emergencias: en situación real, 016 / 112.
