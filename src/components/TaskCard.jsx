import { useState } from 'react';

function formatDueDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day)
    .toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
    .replaceAll('.', '');
}

export default function TaskCard({ task, dragRef, handleRef, isDragging, onUpdate, onToggle, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  async function save(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    if (await onUpdate(task.id, { title: trimmedTitle, dueDate: dueDate || null })) {
      setEditing(false);
    }
  }

  function cancelEdit() {
    setTitle(task.title);
    setDueDate(task.dueDate || '');
    setEditing(false);
  }

  async function removeTask() {
    if (window.confirm(`¿Eliminar la tarea «${task.title}»?`)) {
      await onDelete(task.id);
    }
  }

  return (
    <article
      ref={dragRef}
      className={`task-card${task.completed ? ' task-card--completed' : ''}${isDragging ? ' task-card--dragging' : ''}`}
      data-dragging={isDragging || undefined}
    >
      {editing ? (
        <form className="task-edit-form" onSubmit={save}>
          <label className="sr-only" htmlFor={`edit-title-${task.id}`}>Título de la tarea</label>
          <input id={`edit-title-${task.id}`} autoFocus value={title} onChange={(event) => setTitle(event.target.value)} />
          <label className="date-label" htmlFor={`edit-date-${task.id}`}>Fecha de vencimiento</label>
          <input id={`edit-date-${task.id}`} type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          <div className="form-actions">
            <button className="text-button" type="submit">Guardar</button>
            <button className="text-button muted" type="button" onClick={cancelEdit}>Cancelar</button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-card__heading">
            <button
              className={`completion-toggle${task.completed ? ' is-complete' : ''}`}
              type="button"
              aria-label={task.completed ? `Marcar «${task.title}» como pendiente` : `Marcar «${task.title}» como completada`}
              aria-pressed={task.completed}
              onClick={() => onToggle(task.id, !task.completed)}
            >
              {task.completed && <span aria-hidden="true">✓</span>}
            </button>
            <p className="task-title" ref={handleRef}>{task.title}</p>
          </div>
          {task.dueDate && <time className="task-date" dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time>}
          <div className="task-actions">
            <button className="text-button muted" type="button" onClick={() => setEditing(true)}>Editar</button>
            <button className="text-button muted" type="button" onClick={removeTask}>Eliminar</button>
          </div>
        </>
      )}
    </article>
  );
}
