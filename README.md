# La Mezquita Mundialista

Web pública y responsive para consultar el ranking, los pronósticos y las
estadísticas de un torneo del Mundial 2026.

## Stack

- Next.js con App Router
- TypeScript
- Tailwind CSS
- Datos públicos desde Google Sheets en formato CSV
- Sin base de datos, autenticación ni backend propio

## Preparar Google Sheets

El documento debe tener tres hojas con estos nombres y encabezados exactos:

### Participantes

| ParticipanteID | Nombre |
| --- | --- |
| P01 | Ana Torres |

### Partidos

| MatchID | Grupo | Fecha | Local | Visitante | ResultadoReal | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| M01 | A | 2026-06-11T16:00:00-04:00 | México | Sudáfrica | L | Finalizado |

Valores permitidos:

- `ResultadoReal`: `L`, `E`, `V` o vacío.
- `Estado`: `Pendiente` o `Finalizado`.
- Se recomienda usar fechas ISO 8601 con zona horaria.

### Pronosticos

| ParticipanteID | MatchID | Pronostico |
| --- | --- | --- |
| P01 | M01 | L |

`Pronostico` acepta `L`, `E` o `V`.

## Publicar cada hoja como CSV

Para cada una de las tres hojas:

1. Abrir el documento en Google Sheets.
2. Ir a **Archivo → Compartir → Publicar en la Web**.
3. Elegir una hoja individual, no el documento completo.
4. Seleccionar **Valores separados por comas (.csv)**.
5. Presionar **Publicar** y copiar la URL generada.
6. Repetir el proceso para `Participantes`, `Partidos` y `Pronosticos`.

La publicación vuelve los datos accesibles para cualquier persona con la URL.
No usar información privada en estas hojas.

## Variables de entorno

Crear un archivo `.env.local` en la raíz:

```env
PARTICIPANTES_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv
PARTIDOS_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv
PRONOSTICOS_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?gid=...&single=true&output=csv
```

Las tres variables deben estar configuradas. Si falta alguna o la descarga
falla, la aplicación usa datos mock para mantener disponible la demo.

Las respuestas CSV se revalidan cada cinco minutos. Puede ajustarse el valor
`revalidate` en `src/lib/csv.ts`.

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

Comandos adicionales:

```bash
npm test
npm run lint
npm run build
```

## Deploy en Vercel

1. Subir el repositorio a GitHub, GitLab o Bitbucket.
2. Importar el repositorio desde el panel de Vercel.
3. Mantener el preset detectado como **Next.js**.
4. Agregar las tres variables CSV en **Settings → Environment Variables**.
5. Aplicarlas a Production y, si corresponde, Preview.
6. Ejecutar el deploy.

No se necesita servicio de base de datos. Las URLs se leen del lado del
servidor y no quedan incluidas en el JavaScript del navegador.

## Reglas de puntuación

- Un partido solo puntúa si `Estado` es `Finalizado`.
- Si `ResultadoReal` está vacío, suma 0.
- Si `Pronostico` coincide con `ResultadoReal`, suma 1 punto.
- En cualquier otro caso, suma 0.

La lógica está aislada en `src/domain/scoring.ts` y cubierta por pruebas
unitarias.
