# Investigación técnica: tablero de tareas Tcanvapro

**Fecha**: 2026-10-20
**Estado**: Decisiones para la versión inicial

## Decisiones

### Aplicación web y almacenamiento

- **Decisión**: React con Vite en el navegador y un servidor local con Node.js 24 LTS, Express 5 y `better-sqlite3`. El servidor expone una API JSON pequeña y es el único proceso que abre el archivo SQLite.
- **Razón**: La aplicación en el navegador necesita una frontera de servidor para leer y guardar el archivo SQLite. Un único proceso Node mantiene la interfaz, la API y el archivo de datos en la misma máquina, sin cuentas ni servicios externos. SQLite documenta su adecuación para almacenamiento local y aplicaciones de baja concurrencia; la línea Node 24 está en soporte LTS hasta abril de 2028. Express 5 es compatible con Node 24.
- **Alternativas consideradas**: `node:sqlite` evita un paquete nativo adicional, pero la documentación de Node lo marca actualmente como *release candidate*. SQLite WebAssembly en el navegador requeriría almacenamiento persistente mediante APIs del navegador y un worker, complejidad innecesaria para esta aplicación.

### Acceso a SQLite

- **Decisión**: Usar `better-sqlite3`, consultas preparadas y transacciones para operaciones que cambian el orden de tareas.
- **Razón**: Su API síncrona y transacciones son directas para las pocas escrituras de un tablero personal. La documentación del proyecto identifica los escenarios de alta concurrencia de escritura como un límite de uso; no forman parte de esta spec.
- **Alternativas consideradas**: Conexión directa desde React no es viable para un archivo SQLite del servidor. No se añade un ORM ni una capa de repositorios para este modelo pequeño.

### Arrastrar, soltar y ordenar

- **Decisión**: Usar `@dnd-kit/react` con `useSortable` para reordenar tareas en la misma columna y moverlas entre columnas. Aplicar el cambio en memoria durante la interacción y persistir el resultado al finalizar el movimiento.
- **Razón**: La guía actual del proyecto cubre listas múltiples y tableros Kanban. Sus sensores predeterminados incluyen puntero y teclado. Se conservan las interacciones de movimiento ya definidas en la spec.
- **Alternativas consideradas**: La API nativa de arrastrar y soltar requeriría resolver manualmente la integración con React, el orden en listas y el uso con teclado.

### Entorno de desarrollo y producción local

- **Decisión**: Vite sirve la interfaz y reenvía `/api` al servidor Express en desarrollo. Un script `npm run dev` inicia ambos procesos locales. En modo de producción local, Express sirve los archivos compilados de Vite y la misma API bajo el mismo origen.
- **Razón**: El cliente usa rutas relativas `/api`, por lo que no requiere CORS ni una URL externa. El mismo servidor es suficiente para el uso de una sola persona.
- **Alternativas consideradas**: Ejecutar manualmente dos comandos de desarrollo añade pasos. Un servidor remoto, autenticación o sincronización no están en la spec.

### Pruebas

- **Decisión**: Vitest como ejecutor común, con pruebas de interfaz en `jsdom` y pruebas de API y SQLite en entorno Node. Usar React Testing Library para verificar resultados visibles de los componentes. Completar el movimiento real con los pasos manuales de `quickstart.md`.
- **Razón**: Vitest reutiliza la configuración de Vite y admite componentes React y entornos `jsdom`/Node. La guía manual hace comprobables los flujos de arrastrar y soltar sin añadir un entorno de navegador automatizado para esta primera versión.
- **Alternativas consideradas**: Un conjunto de pruebas de extremo a extremo con navegador agrega dependencias y mantenimiento que la escala de un tablero personal no justifica inicialmente.

### Fidelidad al prototipo y alcance

- **Decisión**: Replicar la composición oscura, columnas, tarjetas, contadores, fechas y controles de agregar que aparecen en el prototipo, junto con las acciones escritas en la spec. No crear interacciones funcionales para etiquetas, comentarios o reacciones.
- **Razón**: El usuario confirmó mantener la spec vigente respecto a esos iconos. La primera carga muestra las tres columnas iniciales vacías; la spec no pide datos de demostración.

## Fuentes

- [Node.js 24 LTS y ventana de soporte](https://nodejs.org/en/blog/migrations/v22-to-v24)
- [Express 5: API de aplicación y middleware JSON](https://expressjs.com/en/5x/api/application/)
- [better-sqlite3: documentación y límites de concurrencia](https://github.com/WiseLibs/better-sqlite3)
- [SQLite: usos apropiados y almacenamiento local](https://www.sqlite.org/whentouse.html)
- [Vite: opciones del servidor y proxy](https://vite.dev/config/server-options)
- [Vite: integración con un backend](https://vite.dev/guide/backend-integration.html)
- [dnd-kit: listas ordenables múltiples tipo Kanban](https://dndkit.com/react/guides/multiple-sortable-lists/)
- [dnd-kit: sensores de puntero y teclado](https://dndkit.com/react/guides/sensors/)
- [Vitest: soporte React y entornos de pruebas](https://vitest.dev/guide/features)
