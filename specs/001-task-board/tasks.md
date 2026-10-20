---
description: "Tareas de implementación para el tablero Kanban de Tcanvapro"
---

# Tasks: Gestor de tareas con tablero Kanban

**Input**: Documentos de diseño en `specs/001-task-board/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/board-api.md`, `quickstart.md`

**Tests**: No se incluyen tareas de pruebas automatizadas porque la spec no las solicita expresamente. Cada historia incluye una comprobación manual desde la aplicación.

**Organization**: Fases ordenadas por historia de usuario y prioridad de la spec.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Inicializar el proyecto único npm con React, Vite y el servidor local previsto.

- [X] T001 Crear `package.json` con scripts `dev`, `build`, `start` y `test`, y dependencias React, Vite, Express 5, better-sqlite3, @dnd-kit/react, concurrently, Vitest y React Testing Library según `plan.md`
- [X] T002 [P] Configurar Vite, JSX y proxy de `/api` hacia el servidor local en `vite.config.js`
- [X] T003 [P] Crear documento HTML con idioma español y punto de montaje React en `index.html`
- [X] T004 [P] Crear entrada inicial React en `src/main.jsx` y archivo de estilos base oscuro en `src/styles.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Preparar almacenamiento, API, manejo de errores y cliente compartido antes de completar cualquier historia.

**⚠️ CRITICAL**: Esta fase bloquea el trabajo de las historias.

- [X] T005 Inicializar SQLite, activar claves foráneas y crear de forma idempotente las tablas de secciones y tareas en `server/database.js`; crear las tres secciones iniciales solo cuando no existan y no insertar tareas de ejemplo
- [X] T006 [P] Configurar Express, middleware JSON, escucha en loopback y respuestas JSON de error sin detalles internos en `server/index.js`
- [X] T007 [P] Implementar en `src/api.js` un cliente JSON de rutas relativas `/api` que convierta errores de la API en mensajes breves en español
- [X] T008 Crear `src/App.jsx` como contenedor React del tablero y estado de carga/error, consumiendo el cliente de `src/api.js`

**Checkpoint**: La aplicación puede iniciar con una base local vacía; la carga del tablero se incorpora en US1.

---

## Phase 3: User Story 1 - Organizar tareas en el tablero (Priority: P1) 🎯 MVP

**Goal**: Ver las tres columnas iniciales, mostrar sus tareas y moverlas entre columnas o posiciones mediante arrastrar y soltar, guardando el orden.

**Independent Test**: Abrir el tablero, crear una tarea (la creación está disponible al completar US2) y arrastrarla entre dos columnas; luego reordenar dos tarjetas y recargar para comprobar ubicación y orden persistentes.

### Implementation for User Story 1

- [X] T009 [P] [US1] Implementar `GET /api/board` con secciones y tareas ordenadas por posición en `server/index.js` y consultas de lectura en `server/database.js`
- [X] T010 [P] [US1] Crear `src/components/Board.jsx` y `src/components/Column.jsx` para presentar secciones como columnas, tareas como tarjetas, contadores calculados y controles visibles según el prototipo
- [X] T011 [US1] Implementar en `src/components/TaskCard.jsx` la tarjeta con título, fecha opcional en formato `es-PE` e indicador visual de completado, sin etiquetas, comentarios ni reacciones
- [X] T012 [US1] Integrar en `src/App.jsx` la carga de `GET /api/board` y la composición de `Board`, conservando en pantalla el último estado confirmado si ocurre un error
- [X] T013 [US1] Implementar en `src/components/Board.jsx` el arrastre entre columnas y el reordenamiento dentro de una columna con `@dnd-kit/react`, manteniendo secciones vacías como destinos válidos
- [X] T014 [US1] Implementar `PATCH /api/tasks/:taskId/position` en `server/index.js` y `server/database.js`; validar tarea, sección y posición, ajustar ambos órdenes en una transacción y devolver errores 400/404 en español
- [X] T015 [US1] Guardar el movimiento al soltar mediante `src/api.js` y `src/components/Board.jsx`; ante fallo, restaurar ubicación y orden confirmados por el servidor

**Checkpoint**: El tablero muestra columnas y tarjetas, y los movimientos y reordenamientos sobreviven a una recarga.

---

## Phase 4: User Story 2 - Crear tareas y secciones (Priority: P2)

**Goal**: Agregar tareas con título y fecha opcional, crear secciones, editar título/fecha y eliminar tareas con confirmación; persistir todos los cambios.

**Independent Test**: Desde el tablero, crear una sección y una tarea con fecha, editarla, confirmar que sus cambios se conservan al recargar y eliminarla confirmando; repetir una eliminación cancelándola y comprobar que permanece.

### Implementation for User Story 2

- [X] T016 [US2] Implementar `POST /api/sections` en `server/index.js` y `server/database.js`; exigir nombre no vacío tras quitar espacios externos y añadir la sección al final
- [X] T017 [US2] Implementar `POST /api/sections/:sectionId/tasks` en `server/index.js` y `server/database.js`; exigir título no vacío tras quitar espacios externos, aceptar fecha `YYYY-MM-DD` válida o `null`, iniciar pendiente y añadir al final
- [X] T018 [US2] Implementar `PATCH /api/tasks/:taskId` para actualizar uno o ambos campos de título y fecha en `server/index.js` y `server/database.js`; admitir `null` para quitar fecha y responder con 400/404 según contrato
- [X] T019 [US2] Implementar `DELETE /api/tasks/:taskId` en `server/index.js` y `server/database.js`, responder 204 al eliminar y 404 si no existe
- [X] T020 [P] [US2] Añadir en `src/components/Column.jsx` el control «Agregar tarea» y el formulario de título obligatorio con fecha opcional, validación visible y cancelación
- [X] T021 [P] [US2] Añadir en `src/components/Board.jsx` el control «Agregar sección» y formulario para nombre obligatorio, manteniendo la nueva columna visible
- [X] T022 [US2] Añadir en `src/components/TaskCard.jsx` las acciones de editar título/fecha y solicitar confirmación antes de eliminar; cancelar conserva la tarjeta
- [X] T023 [US2] Conectar altas, edición y eliminación a `src/api.js`, actualizar el tablero tras respuestas satisfactorias y presentar errores breves sin perder los datos confirmados en `src/App.jsx`

**Checkpoint**: Tareas y secciones creadas, editadas y eliminadas se reflejan y persisten conforme a la interacción confirmada.

---

## Phase 5: User Story 3 - Marcar el avance de una tarea (Priority: P3)

**Goal**: Cambiar una tarea entre pendiente y completada sin cambiar su columna.

**Independent Test**: En una tarjeta, activar y desactivar el indicador; comprobar visualmente cada estado y que la tarea siga en su columna después de recargar.

### Implementation for User Story 3

- [X] T024 [US3] Implementar `PATCH /api/tasks/:taskId/completion` en `server/index.js` y `server/database.js`; guardar el booleano solicitado y responder 400/404 según contrato
- [X] T025 [US3] Conectar el indicador de `src/components/TaskCard.jsx` con la API desde `src/App.jsx`; actualizar solo el estado de completado y conservar sección y posición confirmadas

**Checkpoint**: El indicador alterna entre completada y pendiente y permanece así tras recargar.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Completar el arranque de producción local y hacer que la guía corresponda a la aplicación implementada.

- [X] T026 [P] Configurar Express para servir los archivos de `dist/` junto con la API en `server/index.js` y ajustar scripts de desarrollo/compilación/producción en `package.json`
- [X] T027 [P] Excluir `data/tcanvapro.sqlite` y archivos auxiliares SQLite del control de versiones en `.gitignore`
- [X] T028 Actualizar `AGENTS.md` y `specs/001-task-board/quickstart.md` con los comandos locales vigentes y pasos manuales para comprobar criterios de éxito desde la interfaz

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias; crear la base ejecutable y los archivos de entrada.
- **Foundational (Phase 2)**: Depende de Setup; bloquea las historias.
- **US1 (Phase 3)**: Depende de Foundational; entrega el MVP de visualización, movimiento y orden.
- **US2 (Phase 4)**: Depende de US1 para integrar las altas, edición y eliminación con columnas y tarjetas existentes.
- **US3 (Phase 5)**: Depende de US1 y US2 para que las tareas y tarjetas estén disponibles en el tablero.
- **Polish (Phase 6)**: Depende de las tres historias para documentar y validar el flujo completo.

### User Story Dependencies

- **US1 (P1)**: Inicia tras Foundational. Su comprobación desde la aplicación requiere que US2 habilite la creación de tareas; por ello, validar el recorrido de arrastre al integrar US2, sin preparar datos fuera de la interfaz.
- **US2 (P2)**: Se integra con las columnas y tarjetas de US1; el alta de tarea habilita su comprobación funcional completa.
- **US3 (P3)**: Requiere una tarea y una tarjeta del flujo integrado de US1/US2.

### Within Each User Story

- Las rutas y operaciones de datos se completan antes de conectarlas a la interfaz.
- Las tareas con `[P]` afectan archivos separados y no dependen de trabajo incompleto de la misma fase.
- Cada checkpoint se comprueba usando el navegador y los pasos descritos en `quickstart.md`.

### Parallel Opportunities

- **Setup**: T002, T003 y T004 pueden avanzar en paralelo después de T001, en archivos separados.
- **Foundational**: T006 y T007 pueden avanzar en paralelo después de T005; T008 requiere T007.
- **US1**: T009 y T010 pueden avanzar en paralelo; T011 requiere los componentes visuales y T012 integra su carga; T013 y T014 pueden avanzar en paralelo una vez definidos Board y la API fundacional.
- **US2**: T016–T019 modifican los mismos archivos `server/index.js` y `server/database.js`; ejecutarlas secuencialmente para evitar conflictos. T020 y T021 pueden avanzar en paralelo cuando US1 está integrado. T022 requiere TaskCard de US1.
- **US3**: T024 requiere el servidor fundacional; T025 requiere la tarjeta de US1 y el cliente de API.
- **Polish**: T026 y T027 pueden avanzar en paralelo; T028 integra los comandos y criterios finales.

### Parallel Examples

#### User Story 1

Tras T009 y T010, implementar movimiento y almacenamiento en paralelo, en archivos distintos:

```text
T013: Implementar arrastre y reordenamiento en src/components/Board.jsx
T014: Implementar PATCH de posición en server/index.js y server/database.js
```

#### User Story 2

Tras completar US1, preparar formularios de alta en componentes separados:

```text
T020: Añadir alta de tareas en src/components/Column.jsx
T021: Añadir alta de secciones en src/components/Board.jsx
```

#### User Story 3

Con US1 disponible, terminar la operación persistente y el control visual en secuencia:

```text
T024: Implementar PATCH de completado en server/index.js y server/database.js
T025: Conectar el indicador de TaskCard.jsx con la API
```

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Setup y Foundational.
2. Completar US1: tablero inicial, lectura y movimiento/reordenamiento persistentes.
3. Completar la creación básica de tarea de US2, necesaria para recorrer US1 desde la interfaz.
4. Comprobar en el navegador columnas, movimiento, orden y persistencia usando los pasos de `quickstart.md`.
5. Detenerse en el MVP si se requiere una primera entrega; el resto de US2 y US3 amplían después la gestión del tablero.

### Incremental Delivery

1. Setup + Foundational: aplicación local conectada con SQLite.
2. US1: columnas y movimiento/reordenamiento persistentes.
3. US2: creación, edición y eliminación confirmada de tareas; creación de secciones.
4. US3: marcar y desmarcar tareas completadas.
5. Polish: arranque local de producción y documentación actualizada.

## Notes

- Cada tarea usa checkbox, ID secuencial, etiquetas de paralelismo/historia cuando corresponden y rutas concretas.
- No se añaden funcionalidades de etiquetas, comentarios, reacciones, cuentas ni conexión con Canva.
- La interacción y persistencia se verifican manualmente en la aplicación; no se crean tareas de pruebas automatizadas en este archivo.
