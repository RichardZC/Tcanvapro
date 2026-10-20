# Guía rápida: validar Tcanvapro en local

## Requisitos

- Node.js 24 LTS y npm.
- Navegador web de escritorio actualizado.

## Instalar y arrancar

Desde la raíz del repositorio:

```powershell
npm install
npm run dev
```

`npm run dev` inicia la interfaz Vite y la API local. Abrir `http://localhost:5173`. En el primer inicio, el servidor crea `data/tcanvapro.sqlite` y las tres secciones vacías.

## Comprobación desde la aplicación

1. Confirmar que se muestran, en tema oscuro, las columnas «Asignadas recientemente», «En proceso» y «Terminado», con controles para agregar secciones y tareas.
2. Desde «Agregar tarea», escribir un título y confirmar; verificar que la tarjeta aparece en su sección en no más de tres acciones visibles. Opcionalmente, incluir una fecha y confirmar el formato peruano.
3. Arrastrar la tarjeta a otra columna y luego a otra posición; confirmar que cambian la ubicación y el orden visibles.
4. Crear una sección y mover una tarea a ella.
5. Marcar una tarea como completada y pendiente; confirmar que su sección no cambia.
6. Editar el título y la fecha de una tarea y guardar; confirmar los datos actualizados.
7. Iniciar la eliminación y cancelarla; confirmar que la tarea sigue visible. Repetir y confirmar la eliminación.
8. Recargar la página; confirmar que las tareas y secciones vigentes, datos, orden y completado se conservan, y que la tarea eliminada no reaparece.

## Compilación y arranque local de producción

```powershell
npm run build
npm start
```

Abrir `http://localhost:3000`. La API y la interfaz compilada se sirven desde el servidor local.
