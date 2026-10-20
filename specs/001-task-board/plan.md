# Implementation Plan: Gestor de tareas con tablero Kanban

**Branch**: `001-task-board` | **Date**: 2026-10-20 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-task-board/spec.md`

## Summary

Crear Tcanvapro como una aplicación web local de un solo tablero. La interfaz React/Vite presentará las tres columnas iniciales, tarjetas oscuras, fechas, contadores y controles de agregar basados en la imagen de referencia. Permitirá las acciones de la spec: crear y editar tareas, moverlas y reordenarlas con arrastrar y soltar, cambiar su completado, eliminarlas con confirmación y añadir secciones.

Un servidor local Node/Express servirá la API de la interfaz y guardará los datos en un archivo SQLite. En el primer inicio se crean las tres secciones vacías. La decisión confirmada mantiene etiquetas, comentarios y reacciones fuera del comportamiento funcional de esta versión.

## Technical Context

**Language/Version**: JavaScript ES modules y JSX; Node.js 24.x LTS.
**Primary Dependencies**: React, Vite, Express 5, `better-sqlite3`, `@dnd-kit/react`; `concurrently` para arrancar interfaz y API con un comando; Vitest y React Testing Library para pruebas.
**Storage**: Archivo SQLite local `data/tcanvapro.sqlite`; esquema inicial creado al arrancar.
**Testing**: Vitest para reglas de datos, API y componentes; guía manual para interacción real de arrastrar y soltar y persistencia desde el navegador.
**Target Platform**: Navegador de escritorio actualizado y servidor Node local en la misma computadora.
**Project Type**: Aplicación web pequeña con interfaz y API local en un solo proyecto npm.
**Performance Goals**: Sin metas de carga separadas en la spec. La validación visible se rige por SC-001 a SC-005.
**Constraints**: Interfaz en español de Perú; diseño oscuro basado en el prototipo; un usuario y un tablero; sin Canva, cuentas ni servicios externos; el archivo SQLite no se versiona. No agregar funciones de etiqueta, comentarios o reacciones.
**Scale/Scope**: Un tablero local; tres secciones iniciales más secciones creadas por el usuario; tareas con título, fecha opcional, completado, sección y orden.

## Constitution Check

**Antes de la investigación**

- **Simplicidad — PASS**: Un proyecto npm, una interfaz, una API pequeña y una base SQLite local. No se añaden cuentas, sincronización, servicios externos ni capas de abstracción anticipadas.
- **Idioma y mercado — PASS**: Los controles, validaciones y errores visibles se redactarán en español de Perú; las fechas se presentarán con configuración `es-PE`. No hay importes en esta funcionalidad.
- **Cero alcance fantasma — PASS**: Las acciones se trazan a FR-001–FR-012. No se implementan los iconos de etiqueta, comentarios y reacciones como funciones; la referencia se usa para la composición visual.
- **Verificable por una persona no técnica — PASS**: `quickstart.md` describe cómo comprobar desde la aplicación los escenarios y criterios SC-001–SC-005.
- **Datos con respeto — PASS**: Se guarda solo la información de tareas y secciones requerida. No hay cuentas ni secretos; SQLite permanece en el equipo y excluido de Git.

No hay bloqueos constitucionales ni aclaraciones pendientes.

## Project Structure

### Documentation (this feature)

```text
specs/001-task-board/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── board-api.md
└── tasks.md                 # Lo crea $speckit-tasks
```

### Source Code (repository root)

```text
package.json
vite.config.js
index.html
src/
├── main.jsx
├── App.jsx                  # Carga del tablero y acciones de nivel superior
├── api.js                   # Llamadas JSON al servidor
├── styles.css               # Estilos del tablero basados en el prototipo
└── components/
    ├── Board.jsx            # Secciones y orden del tablero
    ├── Column.jsx           # Encabezado, contador y lista de tarjetas
    └── TaskCard.jsx         # Tarjeta, fecha, completado y acciones
server/
├── index.js                 # Express, rutas y servicio de estáticos
└── database.js              # Apertura, esquema y consultas SQLite
tests/
├── board-api.test.js
└── board-ui.test.jsx
data/                        # Se crea al iniciar; archivos SQLite ignorados por Git
```

**Structure Decision**: Un único proyecto npm evita un monorepo. `src/` contiene la interfaz React; `server/` limita el acceso al archivo SQLite. La UI conserva estado temporal durante la interacción y confirma los cambios mediante la API. No se crean capas de modelos, servicios o repositorios separadas para esta primera versión.

## Design Decisions

1. **Una API local para el archivo SQLite**: el navegador llama rutas relativas `/api`. Vite las reenvía a Express en desarrollo; Express sirve `dist/` junto con la API en el arranque local de producción.
2. **Datos mínimos**: `sections` almacena identificador, nombre y posición; `tasks` almacena identificador, sección, título, fecha opcional, completado y posición. El tablero único es una entidad lógica, sin una tabla `boards` adicional.
3. **Fechas de calendario**: la API recibe y devuelve `YYYY-MM-DD`; la UI presenta la fecha con formato `es-PE`. No se almacena hora ni zona horaria para evitar cambios de día.
4. **Movimiento atómico**: el destino y la posición se validan; el reordenamiento de origen y destino se escribe en una transacción SQLite. Un movimiento fallido conserva el último orden guardado.
5. **Secciones iniciales una sola vez**: si la base no tiene secciones, iniciar con «Asignadas recientemente», «En proceso» y «Terminado» en ese orden. No sembrar tarjetas de ejemplo.
6. **Arrastrar y soltar**: `@dnd-kit/react` implementa el reordenamiento dentro y entre columnas; conservar sensores de puntero y teclado predeterminados. Guardar en el servidor al completar el movimiento, no en cada evento de puntero.
7. **Estilo**: fondo oscuro, columnas alineadas horizontalmente, tarjetas en gris oscuro, títulos claros, fechas en rojo y controles en español. Los contadores se calculan a partir de las tareas vigentes en cada sección.
8. **Privacidad local**: Express escucha en loopback; el archivo y sus archivos auxiliares quedan fuera del control de versiones. No hay CORS, autenticación ni secretos.

## Re-evaluación de la Constitución

- **Simplicidad — PASS**: La única complejidad añadida al frontend es la API necesaria para el acceso seguro y persistente a SQLite y una dependencia enfocada para ordenar listas.
- **Idioma y mercado — PASS**: Las respuestas de validación, confirmación, controles y fechas usan español de Perú.
- **Cero alcance fantasma — PASS**: API y modelo corresponden a acciones de la spec. Las secciones solo se agregan; la spec no define renombrarlas ni eliminarlas. No se añaden funciones visibles en el prototipo que el usuario dejó fuera del alcance.
- **Verificable por una persona no técnica — PASS**: Los escenarios manuales cubren alta, edición, movimiento, completado, confirmación de eliminación y persistencia.
- **Datos con respeto — PASS**: No se solicita información personal adicional y el archivo local no se incluye en Git.

La estructura satisface la spec sin violaciones que requieran excepciones.
