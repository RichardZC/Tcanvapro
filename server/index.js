import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createSection,
  createTask,
  deleteTask,
  getBoard,
  moveTask,
  setTaskCompletion,
  updateTask,
} from './database.js';

const app = express();
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const productionBuild = path.join(projectRoot, 'dist');
app.disable('x-powered-by');
app.use(express.json({ limit: '20kb' }));

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function parseId(value) {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

app.get('/api/board', (_request, response) => {
  response.json(getBoard());
});

app.post('/api/sections', (request, response) => {
  if (!isObject(request.body) || typeof request.body.name !== 'string' || !request.body.name.trim()) {
    return response.status(400).json({ error: 'Escribe un nombre para la sección.' });
  }
  response.status(201).json(createSection(request.body.name.trim()));
});

app.post('/api/sections/:sectionId/tasks', (request, response) => {
  const sectionId = parseId(request.params.sectionId);
  const body = request.body;
  if (!sectionId) return response.status(404).json({ error: 'No se encontró la sección.' });
  if (!isObject(body) || typeof body.title !== 'string' || !body.title.trim()) {
    return response.status(400).json({ error: 'Escribe un título para la tarea.' });
  }
  const dueDate = body.dueDate ?? null;
  if (dueDate !== null && !isValidDate(dueDate)) {
    return response.status(400).json({ error: 'La fecha ingresada no es válida.' });
  }
  const task = createTask(sectionId, body.title.trim(), dueDate);
  if (!task) return response.status(404).json({ error: 'No se encontró la sección.' });
  return response.status(201).json(task);
});

app.patch('/api/tasks/:taskId', (request, response) => {
  const taskId = parseId(request.params.taskId);
  const body = request.body;
  if (!taskId) return response.status(404).json({ error: 'No se encontró la tarea.' });
  if (!isObject(body) || (!Object.hasOwn(body, 'title') && !Object.hasOwn(body, 'dueDate'))) {
    return response.status(400).json({ error: 'Indica el título o la fecha que deseas actualizar.' });
  }
  if (Object.hasOwn(body, 'title') && (typeof body.title !== 'string' || !body.title.trim())) {
    return response.status(400).json({ error: 'El título no puede quedar vacío.' });
  }
  if (Object.hasOwn(body, 'dueDate') && body.dueDate !== null && !isValidDate(body.dueDate)) {
    return response.status(400).json({ error: 'La fecha ingresada no es válida.' });
  }
  const changes = {};
  if (Object.hasOwn(body, 'title')) changes.title = body.title.trim();
  if (Object.hasOwn(body, 'dueDate')) changes.dueDate = body.dueDate;
  const task = updateTask(taskId, changes);
  if (!task) return response.status(404).json({ error: 'No se encontró la tarea.' });
  return response.json(task);
});

app.patch('/api/tasks/:taskId/completion', (request, response) => {
  const taskId = parseId(request.params.taskId);
  if (!taskId) return response.status(404).json({ error: 'No se encontró la tarea.' });
  if (!isObject(request.body) || typeof request.body.completed !== 'boolean') {
    return response.status(400).json({ error: 'Indica si la tarea está completada.' });
  }
  const task = setTaskCompletion(taskId, request.body.completed);
  if (!task) return response.status(404).json({ error: 'No se encontró la tarea.' });
  return response.json(task);
});

app.patch('/api/tasks/:taskId/position', (request, response) => {
  const taskId = parseId(request.params.taskId);
  const body = request.body;
  const sectionId = isObject(body) ? parseId(body.sectionId) : null;
  if (!taskId) return response.status(404).json({ error: 'No se encontró la tarea.' });
  if (!sectionId || !Number.isInteger(body.position)) {
    return response.status(400).json({ error: 'La sección o posición indicada no es válida.' });
  }
  const task = moveTask(taskId, sectionId, body.position);
  if (!task) {
    const board = getBoard();
    const exists = board.sections.some((section) => section.id === sectionId);
    return response.status(404).json({
      error: exists ? 'No se encontró la tarea.' : 'No se encontró la sección.',
    });
  }
  if (task.error) return response.status(400).json({ error: task.error });
  return response.json(task);
});

app.delete('/api/tasks/:taskId', (request, response) => {
  const taskId = parseId(request.params.taskId);
  if (!taskId || !deleteTask(taskId)) {
    return response.status(404).json({ error: 'No se encontró la tarea.' });
  }
  return response.status(204).end();
});

app.use('/api', (_request, response) => {
  response.status(404).json({ error: 'No se encontró la operación solicitada.' });
});

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && error.status === 400) {
    return response.status(400).json({ error: 'La solicitud no tiene un formato válido.' });
  }
  return response.status(500).json({ error: 'No se pudo completar la operación. Inténtalo nuevamente.' });
});

app.use(express.static(productionBuild));
app.use((request, response, next) => {
  if (request.method === 'GET' && !request.path.startsWith('/api')) {
    return response.sendFile(path.join(productionBuild, 'index.html'), (error) => {
      if (error) next();
    });
  }
  return next();
});

app.listen(3000, '127.0.0.1', () => {
  console.log('Tcanvapro disponible en http://localhost:3000');
});
