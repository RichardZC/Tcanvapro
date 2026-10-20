import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDirectory = path.join(projectRoot, 'data');
mkdirSync(dataDirectory, { recursive: true });

const database = new Database(path.join(dataDirectory, 'tcanvapro.sqlite'));
database.pragma('foreign_keys = ON');
database.pragma('journal_mode = WAL');
database.exec(`
  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    position INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date TEXT,
    completed INTEGER NOT NULL DEFAULT 0 CHECK (completed IN (0, 1)),
    position INTEGER NOT NULL
  );
`);

if (database.prepare('SELECT COUNT(*) AS total FROM sections').get().total === 0) {
  const insertSection = database.prepare('INSERT INTO sections (name, position) VALUES (?, ?)');
  database.transaction(() => {
    ['Asignadas recientemente', 'En proceso', 'Terminado'].forEach((name, position) => {
      insertSection.run(name, position);
    });
  })();
}

const sectionById = database.prepare('SELECT id, name, position FROM sections WHERE id = ?');
const taskById = database.prepare(`
  SELECT id, section_id AS sectionId, title, due_date AS dueDate,
    completed, position FROM tasks WHERE id = ?
`);

function serializeTask(task) {
  if (!task) return null;
  return { ...task, completed: Boolean(task.completed) };
}

export function getBoard() {
  const sections = database.prepare('SELECT id, name, position FROM sections ORDER BY position, id').all();
  const tasks = database.prepare(`
    SELECT id, section_id AS sectionId, title, due_date AS dueDate,
      completed, position FROM tasks ORDER BY position, id
  `).all();
  return {
    sections: sections.map((section) => ({
      ...section,
      tasks: tasks.filter((task) => task.sectionId === section.id).map(serializeTask),
    })),
  };
}

export function createSection(name) {
  const position = database.prepare('SELECT COALESCE(MAX(position) + 1, 0) AS next FROM sections').get().next;
  const result = database.prepare('INSERT INTO sections (name, position) VALUES (?, ?)').run(name, position);
  return sectionById.get(result.lastInsertRowid);
}

export function createTask(sectionId, title, dueDate) {
  const section = sectionById.get(sectionId);
  if (!section) return null;
  const position = database.prepare(
    'SELECT COUNT(*) AS total FROM tasks WHERE section_id = ?',
  ).get(sectionId).total;
  const result = database.prepare(`
    INSERT INTO tasks (section_id, title, due_date, completed, position)
    VALUES (?, ?, ?, 0, ?)
  `).run(sectionId, title, dueDate, position);
  return serializeTask(taskById.get(result.lastInsertRowid));
}

export function updateTask(taskId, changes) {
  const task = taskById.get(taskId);
  if (!task) return null;
  const title = changes.title ?? task.title;
  const dueDate = Object.hasOwn(changes, 'dueDate') ? changes.dueDate : task.dueDate;
  database.prepare('UPDATE tasks SET title = ?, due_date = ? WHERE id = ?').run(title, dueDate, taskId);
  return serializeTask(taskById.get(taskId));
}

export function setTaskCompletion(taskId, completed) {
  if (!taskById.get(taskId)) return null;
  database.prepare('UPDATE tasks SET completed = ? WHERE id = ?').run(Number(completed), taskId);
  return serializeTask(taskById.get(taskId));
}

export function moveTask(taskId, sectionId, position) {
  const task = taskById.get(taskId);
  const targetSection = sectionById.get(sectionId);
  if (!task || !targetSection) return null;

  const getSectionTasks = database.prepare(`
    SELECT id FROM tasks WHERE section_id = ? ORDER BY position, id
  `);
  const writePositions = database.prepare('UPDATE tasks SET section_id = ?, position = ? WHERE id = ?');

  return database.transaction(() => {
    const sourceTasks = getSectionTasks.all(task.sectionId).filter((item) => item.id !== taskId);
    const destinationTasks = task.sectionId === sectionId
      ? sourceTasks
      : getSectionTasks.all(sectionId);

    if (!Number.isInteger(position) || position < 0 || position > destinationTasks.length) {
      return { error: 'La posición indicada no es válida.' };
    }

    destinationTasks.splice(position, 0, { id: taskId });
    sourceTasks.forEach((item, index) => writePositions.run(task.sectionId, index, item.id));
    destinationTasks.forEach((item, index) => writePositions.run(sectionId, index, item.id));
    return serializeTask(taskById.get(taskId));
  })();
}

export function deleteTask(taskId) {
  const task = taskById.get(taskId);
  if (!task) return false;
  database.transaction(() => {
    database.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
    database.prepare(`
      UPDATE tasks SET position = position - 1
      WHERE section_id = ? AND position > ?
    `).run(task.sectionId, task.position);
  })();
  return true;
}
