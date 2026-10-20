import { useState } from 'react';
import { useDroppable } from '@dnd-kit/react';
import { CollisionPriority } from '@dnd-kit/abstract';
import TaskCard from './TaskCard.jsx';

export default function Column({ section, onCreateTask, onUpdateTask, onSetCompletion, onDeleteTask, taskRenderer }) {
  const [addingTask, setAddingTask] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const group = `section-${section.id}`;
  const { isDropTarget, ref } = useDroppable({
    id: group,
    type: 'section',
    accept: 'task',
    collisionPriority: CollisionPriority.Low,
  });

  async function createTask(event) {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreateTask(section.id, { title: title.trim(), dueDate: dueDate || null });
    setTitle('');
    setDueDate('');
    setAddingTask(false);
  }

  return (
    <section className={`board-column${isDropTarget ? ' board-column--drop-target' : ''}`} aria-label={section.name}>
      <header className="column-heading">
        <h2>{section.name}</h2>
        <span className="task-count" aria-label={`${section.tasks.length} tareas`}>{section.tasks.length}</span>
      </header>
      <div className="column-content" ref={ref}>
        <div className="task-list">
          {section.tasks.map((task, index) => taskRenderer ? taskRenderer(task, index) : (
            <TaskCard
              key={task.id}
              task={task}
              onUpdate={onUpdateTask}
              onToggle={onSetCompletion}
              onDelete={onDeleteTask}
            />
          ))}
          {addingTask && (
            <form className="task-composer" onSubmit={createTask}>
              <label className="sr-only" htmlFor={`new-task-${section.id}`}>Escribe el nombre de la tarea</label>
              <input
                id={`new-task-${section.id}`}
                autoFocus
                placeholder="Escribe el nombre de la tarea"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <label className="date-label" htmlFor={`new-date-${section.id}`}>Fecha de vencimiento (opcional)</label>
              <input id={`new-date-${section.id}`} type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
              <div className="form-actions">
                <button type="submit" className="text-button">Agregar tarea</button>
                <button type="button" className="text-button muted" onClick={() => setAddingTask(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
        {!addingTask && (
          <button className="add-task-button" type="button" onClick={() => setAddingTask(true)}>
            <span aria-hidden="true">＋</span> Agregar tarea
          </button>
        )}
      </div>
    </section>
  );
}
