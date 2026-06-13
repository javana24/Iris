# Contenido pedagógico del instituto

Material fuente en subcarpetas `PUNTO *`. El servidor usa `cache.json`, generada a partir de los `.docx`.

## Actualizar tras cambiar documentos

```bash
cd server
npm run build:institute
npm run dev
```

Si añades o modificas Word en esta carpeta, el servidor regenera la cache automáticamente al arrancar si detecta cambios.

## Uso en la IA

- **Consejero** (`simulatorMode: iris`): puntos 1, 2, 4, 5, 6, 7, 8 y 9.
- **Pareja celosa** (`simulatorMode: partner`): puntos 2 y 4 (lenguaje y señales).

La misma base sirve para **web y móvil** porque ambos llaman a `POST /api/chat`.

## API

- `GET /api/health` → incluye resumen `institute`
- `GET /api/institute/topics` → listado de puntos cargados
