# Contrato interno: API del tablero

La API JSON la consume la interfaz de Tcanvapro desde el mismo origen. Es una interfaz interna de la aplicación; no se ofrece integración para clientes externos.

## Representaciones

```json
{
  "sections": [
    {
      "id": 1,
      "name": "Asignadas recientemente",
      "position": 0,
      "tasks": [
        {
          "id": 1,
          "sectionId": 1,
          "title": "Preparar propuesta",
          "dueDate": null,
          "completed": false,
          "position": 0
        }
      ]
    }
  ]
}
```

Los ejemplos ilustran el formato; no son tareas que deban cargarse como datos iniciales.

## Operaciones

| Método y ruta | Entrada | Resultado satisfactorio |
|---|---|---|
| `GET /api/board` | Ninguna | `200`; tablero con secciones y tareas ordenadas. |
| `POST /api/sections` | `{ "name": "Por revisar" }` | `201`; sección creada al final de las columnas. |
| `POST /api/sections/:sectionId/tasks` | `{ "title": "Preparar propuesta", "dueDate": "2026-10-20" }`; `dueDate` se puede omitir o enviar como `null`. | `201`; tarea creada al final de la sección. |
| `PATCH /api/tasks/:taskId` | Uno o ambos campos: `{ "title": "Nuevo título", "dueDate": null }`. | `200`; tarea con título o fecha actualizados. `null` quita la fecha. |
| `PATCH /api/tasks/:taskId/completion` | `{ "completed": true }` | `200`; tarea con el estado solicitado. |
| `PATCH /api/tasks/:taskId/position` | `{ "sectionId": 2, "position": 0 }` | `200`; tarea movida o reordenada. El ajuste de ambos órdenes se guarda como una operación atómica. |
| `DELETE /api/tasks/:taskId` | Ninguna | `204`; tarea eliminada después de que la interfaz confirme la acción con el usuario. |

## Errores y validación

- `400` con `{ "error": "..." }` para título o nombre vacío, fecha no válida, cuerpo incorrecto o posición no válida.
- `404` con `{ "error": "..." }` para tarea o sección inexistente.
- La interfaz muestra mensajes breves en español si una operación no se guarda y refleja el último estado confirmado por el servidor.
- La respuesta de error no incluye rutas locales, consultas SQL, trazas ni otros detalles internos.
- El servidor escucha en la interfaz de loopback durante el uso local. No se añade autenticación porque la spec define un único usuario y un tablero local.
