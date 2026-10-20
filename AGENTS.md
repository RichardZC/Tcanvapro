# Memoria técnica

- **App:** Tcanvapro, gestor de tareas mediante un tablero Kanban propio.
- **Stack vigente:** React y Vite; servidor local Node.js/Express; datos en SQLite mediante `better-sqlite3`; drag and drop con `@dnd-kit/react`.
- **Local:** Node.js 24 LTS y npm. Ejecutar `npm install` y `npm run dev`; abrir `http://localhost:5173`. Compilar con `npm run build`; ejecutar compilación local con `npm start` en `http://localhost:3000`.
- **Convenciones:** módulos ES y JSX; código simple, solo alcance de la spec, interfaz en español de Perú y fechas `es-PE`; solicitar solo datos imprescindibles; no incluir secretos. SQLite local y sus archivos auxiliares no se versionan. Comprobar flujos desde la app según `specs/001-task-board/quickstart.md`.

Las reglas de producto viven en .specify/memory/constitution.md y el estado del producto en specs/README.md
