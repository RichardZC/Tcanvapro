# Modelo de datos: tablero de tareas

## Alcance de datos

La versión inicial contiene un tablero lógico único y local. El tablero es la pantalla raíz de la aplicación y no requiere una fila propia de almacenamiento. Las secciones y tareas se guardan en SQLite.

## Entidades

### Sección

| Campo | Tipo conceptual | Regla |
|---|---|---|
| `id` | Entero | Identificador generado y estable. |
| `name` | Texto | Obligatorio; se guarda sin espacios sobrantes al inicio o al final. |
| `position` | Entero | Orden visible de la columna. |

El primer inicio crea, en este orden, «Asignadas recientemente», «En proceso» y «Terminado», solo si todavía no hay secciones. En la versión inicial se pueden añadir secciones; la spec no define renombrarlas ni eliminarlas.

### Tarea

| Campo | Tipo conceptual | Regla |
|---|---|---|
| `id` | Entero | Identificador generado y estable. |
| `sectionId` | Entero | Referencia obligatoria a una sección existente. |
| `title` | Texto | Obligatorio; no puede quedar vacío después de quitar espacios sobrantes. |
| `dueDate` | Fecha o nulo | Opcional; fecha de calendario almacenada como `YYYY-MM-DD`, sin hora ni zona horaria. |
| `completed` | Booleano | Empieza en falso; es independiente de la sección. |
| `position` | Entero | Orden visible dentro de la sección. |

Un cambio de sección actualiza `sectionId` y ajusta el orden de origen y destino en una transacción. La eliminación confirmada borra la tarea. No se define una restricción de título único.

## Relaciones y presentación

- El tablero contiene varias secciones.
- Cada sección contiene cero o más tareas; cada tarea pertenece a una sola sección.
- Las secciones se muestran por `position`; sus tareas también se muestran por `position`.
- El contador del encabezado de sección se calcula a partir de sus tareas vigentes.
- La fecha se presenta en la interfaz con formato de español de Perú; el dato almacenado permanece como fecha de calendario.
- La spec no define etiquetas, comentarios, reacciones, adjuntos, usuarios, historial ni sincronización.

## Persistencia inicial

- Base de datos local: `data/tcanvapro.sqlite`.
- Activar claves foráneas de SQLite en la conexión.
- Crear las tablas con instrucciones idempotentes al iniciar; no añadir una herramienta de migraciones para el esquema inicial.
- Excluir archivos SQLite y archivos auxiliares de journaling del control de versiones.
