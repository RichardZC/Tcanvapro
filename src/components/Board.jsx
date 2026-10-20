import { useEffect, useRef, useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';
import Column from './Column.jsx';
import TaskCard from './TaskCard.jsx';

function SortableTaskCard({ task, index, sectionId, actions }) {
  const sortable = useSortable({
    id: `task-${task.id}`,
    index,
    type: 'task',
    accept: 'task',
    group: `section-${sectionId}`,
  });
  return (
    <TaskCard
      key={task.id}
      task={task}
      dragRef={sortable.ref}
      handleRef={sortable.handleRef}
      isDragging={sortable.isDragging}
      onUpdate={actions.onUpdateTask}
      onToggle={actions.onSetCompletion}
      onDelete={actions.onDeleteTask}
    />
  );
}

function sameOrder(left, right) {
  return left.sections.every((section, sectionIndex) => {
    const otherSection = right.sections[sectionIndex];
    return section.id === otherSection?.id
      && section.tasks.length === otherSection.tasks.length
      && section.tasks.every((task, index) => task.id === otherSection.tasks[index]?.id);
  });
}

export default function Board({ board: savedBoard, ...actions }) {
  const [board, setBoard] = useState(savedBoard);
  const [addingSection, setAddingSection] = useState(false);
  const [sectionName, setSectionName] = useState('');
  const boardRef = useRef(savedBoard);
  const dragStartBoard = useRef(savedBoard);

  useEffect(() => {
    setBoard(savedBoard);
    boardRef.current = savedBoard;
  }, [savedBoard]);

  function updateBoard(updater) {
    setBoard((current) => {
      const updated = updater(current);
      boardRef.current = updated;
      return updated;
    });
  }

  function reorderGroups(current, event) {
    const groups = Object.fromEntries(current.sections.map((section) => [
      `section-${section.id}`,
      section.tasks.map((task) => ({ id: `task-${task.id}`, task })),
    ]));
    const movedGroups = move(groups, event);
    return {
      ...current,
      sections: current.sections.map((section) => ({
        ...section,
        tasks: (movedGroups[`section-${section.id}`] || groups[`section-${section.id}`])
          .map((item) => item.task),
      })),
    };
  }

  async function finishDrag(event) {
    const { source, target } = event.operation;
    if (event.canceled || !target || source?.type !== 'task') {
      updateBoard(() => dragStartBoard.current);
      return;
    }

    const previous = dragStartBoard.current;
    const current = boardRef.current;
    if (sameOrder(previous, current)) return;

    const taskId = Number(String(source.id).replace(/^task-/, ''));
    const destination = current.sections.find((section) => section.tasks.some((task) => task.id === taskId));
    if (!destination) {
      updateBoard(() => previous);
      return;
    }
    const position = destination.tasks.findIndex((task) => task.id === taskId);
    await actions.onMoveTask(taskId, destination.id, position);
  }

  async function createSection(event) {
    event.preventDefault();
    if (!sectionName.trim()) return;
    const created = await actions.onCreateSection(sectionName.trim());
    if (created) {
      setSectionName('');
      setAddingSection(false);
    }
  }

  const cardActions = {
    onUpdateTask: actions.onUpdateTask,
    onSetCompletion: actions.onSetCompletion,
    onDeleteTask: actions.onDeleteTask,
  };

  return (
    <div className="board-page">
      <DragDropProvider
        onDragStart={() => { dragStartBoard.current = boardRef.current; }}
        onDragOver={(event) => {
          if (event.operation.source?.type !== 'task') return;
          updateBoard((current) => reorderGroups(current, event));
        }}
        onDragEnd={finishDrag}
      >
        <div className="board-columns">
          {board.sections.map((section) => (
            <Column
              key={section.id}
              section={section}
              onCreateTask={actions.onCreateTask}
              onUpdateTask={actions.onUpdateTask}
              onSetCompletion={actions.onSetCompletion}
              onDeleteTask={actions.onDeleteTask}
              taskRenderer={(task, index) => (
                <SortableTaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  sectionId={section.id}
                  actions={cardActions}
                />
              )}
            />
          ))}
          <div className="add-section-slot">
        {addingSection ? (
          <form className="section-composer" onSubmit={createSection}>
            <label className="sr-only" htmlFor="new-section-name">Nombre de la sección</label>
            <input
              id="new-section-name"
              autoFocus
              placeholder="Nombre de la sección"
              value={sectionName}
              onChange={(event) => setSectionName(event.target.value)}
              required
            />
            <button className="text-button" type="submit">Agregar</button>
            <button className="text-button muted" type="button" onClick={() => setAddingSection(false)}>Cancelar</button>
          </form>
        ) : (
          <button className="add-section-button" type="button" onClick={() => setAddingSection(true)}>
            <span aria-hidden="true">＋</span> Agregar sección
          </button>
        )}
          </div>
        </div>
      </DragDropProvider>
    </div>
  );
}
