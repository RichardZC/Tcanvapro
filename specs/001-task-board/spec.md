# Feature Specification: Gestor de tareas con tablero Kanban

**Feature Branch**: `001-task-board`

**Created**: 2026-10-20

**Status**: Draft

**Input**: User description: "Crea la especificacion de un gestor de tareas llamado tcanvapro, debe manejar la gestion de tareas con el tablero canva, debe ser simple para poder mover las tareas segun drag and drop, usa como referencia la imagen adjunta validada."

## Clarifications

### Session 2026-10-20

- Q: ¿Con «tablero Canva» te refieres a un tablero de columnas tipo Kanban dentro de Tcanvapro, sin conexión con el servicio Canva? → A: Tablero propio de columnas, sin integración con Canva (opción A).
- Q: ¿Qué acciones podrá realizar el usuario sobre una tarea después de crearla? → A: Editar el título y la fecha; eliminar la tarea con confirmación (opción A).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Organizar tareas en el tablero (Priority: P1)

Como usuario de Tcanvapro, quiero ver mis tareas organizadas en columnas y moverlas arrastrándolas, para reconocer su estado y actualizarlo de forma sencilla.

**Why this priority**: Ver y cambiar el estado de las tareas es el propósito central del tablero.

**Independent Test**: Crear una tarea y arrastrarla desde «Asignadas recientemente» hasta «En proceso»; confirmar que aparece en la columna de destino.

**Acceptance Scenarios**:

1. **Given** el tablero sin tareas, **When** el usuario lo abre, **Then** ve las columnas «Asignadas recientemente», «En proceso» y «Terminado».
2. **Given** una tarea en una columna, **When** el usuario la arrastra y suelta sobre otra columna, **Then** la tarea aparece en la columna de destino y deja de aparecer en la columna de origen.
3. **Given** varias tareas en una columna, **When** el usuario arrastra una tarea a otra posición de esa columna, **Then** el orden visible refleja la nueva posición.

### User Story 2 - Crear tareas y secciones (Priority: P2)

Como usuario, quiero añadir tareas y secciones al tablero, para organizar trabajo nuevo conforme aparece.

**Why this priority**: El tablero necesita permitir que el usuario incorpore el trabajo que desea gestionar.

**Independent Test**: Añadir una tarea con título y fecha opcional, y crear una sección; confirmar que ambas aparecen en el tablero.

**Acceptance Scenarios**:

1. **Given** el tablero abierto, **When** el usuario elige «Agregar tarea», escribe un título y confirma, **Then** la tarea aparece en la sección desde la que inició la creación.
2. **Given** el formulario de una tarea, **When** el usuario añade una fecha de vencimiento, **Then** la fecha aparece en la tarjeta con formato usado en Perú.
3. **Given** el tablero abierto, **When** el usuario elige «Agregar sección» e ingresa un nombre, **Then** aparece una nueva columna con ese nombre.
4. **Given** que existe una nueva sección, **When** el usuario mueve una tarea a ella mediante arrastrar y soltar, **Then** la tarea aparece en esa sección.
5. **Given** que el usuario creó y organizó tareas y secciones, **When** cierra y vuelve a abrir el tablero, **Then** se conservan las tareas y secciones, sus títulos, fechas, orden y estados de completado.
6. **Given** una tarea existente, **When** el usuario cambia su título o fecha y guarda, **Then** la tarjeta muestra los datos actualizados.
7. **Given** una tarea existente, **When** el usuario elige eliminarla y confirma, **Then** la tarea deja de aparecer en el tablero.
8. **Given** una solicitud de eliminación, **When** el usuario cancela la confirmación, **Then** la tarea permanece en el tablero.
9. **Given** que el usuario confirmó la eliminación de una tarea, **When** cierra y vuelve a abrir el tablero, **Then** la tarea eliminada no vuelve a aparecer.

### User Story 3 - Marcar el avance de una tarea (Priority: P3)

Como usuario, quiero marcar una tarea como completada o pendiente, para distinguir visualmente su avance sin cambiar su sección.

**Why this priority**: La referencia muestra un indicador de completado en las tarjetas; esta acción complementa el estado representado por las columnas.

**Independent Test**: Marcar una tarea como completada y volver a marcarla como pendiente; confirmar que el indicador cambia en cada acción.

**Acceptance Scenarios**:

1. **Given** una tarea pendiente, **When** el usuario activa su indicador de completado, **Then** la tarjeta muestra que está completada.
2. **Given** una tarea completada, **When** el usuario desactiva su indicador, **Then** la tarjeta vuelve a mostrarse pendiente y permanece en la misma sección.

### Edge Cases

- Si el usuario intenta guardar una tarea sin título, el tablero solicita un título y no crea una tarjeta vacía.
- Si el usuario suelta una tarea fuera de una columna válida, la tarea conserva su sección y posición anteriores.
- Si una sección no contiene tareas, permanece visible y permite agregar tareas o recibir tareas movidas.
- Si no se asigna fecha de vencimiento, la tarjeta se muestra sin fecha.
- Si el usuario cancela la confirmación de eliminación, la tarea y sus datos permanecen sin cambios.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El tablero MUST mostrar inicialmente las secciones «Asignadas recientemente», «En proceso» y «Terminado».
- **FR-002**: El usuario MUST poder crear una tarea con título obligatorio dentro de una sección.
- **FR-003**: El usuario MUST poder asignar una fecha de vencimiento opcional a una tarea.
- **FR-004**: El usuario MUST poder mover una tarea entre secciones y cambiar su orden dentro de una sección mediante arrastrar y soltar.
- **FR-005**: El tablero MUST actualizar la ubicación visible de una tarea al soltarla en una sección válida.
- **FR-006**: El usuario MUST poder crear una sección con un nombre.
- **FR-007**: El usuario MUST poder marcar una tarea como completada y devolverla al estado pendiente sin cambiar su sección.
- **FR-008**: Los cambios de tareas, secciones, orden y completado MUST conservarse al cerrar y volver a abrir el tablero.
- **FR-009**: Los textos de la interfaz MUST estar en español de Perú y las fechas MUST presentarse en un formato habitual para Perú.
- **FR-010**: La distribución del tablero MUST presentar las secciones como columnas y las tareas como tarjetas, siguiendo la referencia visual proporcionada.
- **FR-011**: El usuario MUST poder editar el título y la fecha de vencimiento de una tarea existente.
- **FR-012**: El usuario MUST poder eliminar una tarea existente solo después de confirmar la acción.

### Key Entities *(include if feature involves data)*

- **Tablero**: Espacio de trabajo que contiene secciones y sus tareas.
- **Sección**: Columna del tablero con un nombre y un orden; contiene tareas.
- **Tarea**: Elemento con título, fecha de vencimiento opcional, estado de completado, sección y posición dentro de ella.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El usuario puede crear una tarea con título en no más de tres acciones visibles desde el tablero.
- **SC-002**: El usuario puede mover una tarea a otra sección con una sola acción de arrastrar y soltar, y ve la tarjeta en su destino al terminar.
- **SC-003**: El usuario puede añadir una sección y verla en el tablero sin salir de la pantalla del tablero.
- **SC-004**: Después de volver a abrir el tablero, se conservan el 100 % de las tareas y secciones vigentes, sus títulos, fechas, ubicaciones, orden y estados de completado; las tareas eliminadas no reaparecen.
- **SC-005**: Una persona no técnica puede verificar desde la interfaz que una tarea cambia entre pendiente y completada y que su sección no cambia al hacerlo.

## Assumptions

- La versión inicial está dirigida a una persona que organiza tareas en un único tablero Kanban propio de Tcanvapro; no contempla cuentas, colaboración, tableros múltiples ni conexión con el servicio Canva.
- Las tres secciones iniciales corresponden a las columnas mostradas en la referencia; el usuario puede añadir secciones con nombres propios.
- La fecha de vencimiento es opcional, tal como muestra la referencia en tarjetas con y sin fecha.
- La referencia guía la distribución oscura en columnas y tarjetas, los controles para agregar tareas y secciones, y el indicador de completado. Los iconos de etiqueta, comentarios y reacciones no definen comportamiento funcional para esta versión.
- No se requiere una conexión con servicios externos para gestionar el tablero.
