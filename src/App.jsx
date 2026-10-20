import { useCallback, useEffect, useState } from 'react';
import { api } from './api.js';
import Board from './components/Board.jsx';

export default function App() {
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshBoard = useCallback(async () => {
    const result = await api.getBoard();
    setBoard(result);
    return result;
  }, []);

  useEffect(() => {
    let active = true;
    api.getBoard()
      .then((result) => {
        if (active) setBoard(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function runAction(action) {
    setError('');
    try {
      await action();
      await refreshBoard();
      return true;
    } catch (actionError) {
      setError(actionError.message);
      try {
        await refreshBoard();
      } catch {
        // Se mantiene en pantalla el último estado confirmado.
      }
      return false;
    }
  }

  if (loading) {
    return <main className="app-state" aria-live="polite">Cargando tu tablero…</main>;
  }

  if (!board) {
    return (
      <main className="app-state">
        <h1>Tcanvapro</h1>
        <p role="alert">{error || 'No se pudo cargar el tablero.'}</p>
        <button className="text-button" onClick={() => runAction(refreshBoard)}>Volver a intentar</button>
      </main>
    );
  }

  return (
    <main className="app-shell">
      {error && <div className="error-banner" role="alert">{error}</div>}
      <Board
        board={board}
        onCreateSection={(name) => runAction(() => api.createSection(name))}
        onCreateTask={(sectionId, values) => runAction(() => api.createTask(sectionId, values))}
        onUpdateTask={(taskId, values) => runAction(() => api.updateTask(taskId, values))}
        onSetCompletion={(taskId, completed) => runAction(() => api.setCompletion(taskId, completed))}
        onDeleteTask={(taskId) => runAction(() => api.deleteTask(taskId))}
        onMoveTask={async (taskId, sectionId, position) => {
          setError('');
          try {
            await api.moveTask(taskId, sectionId, position);
            await refreshBoard();
          } catch (moveError) {
            setError(moveError.message);
            await refreshBoard().catch(() => {});
          }
        }}
      />
    </main>
  );
}
