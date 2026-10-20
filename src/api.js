async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`/api${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  } catch {
    throw new Error('No se pudo conectar con Tcanvapro. Verifica que la aplicación esté en ejecución.');
  }

  if (!response.ok) {
    const result = response.status === 204 ? null : await response.json().catch(() => null);
    throw new Error(result?.error || 'No se pudo guardar el cambio. Inténtalo nuevamente.');
  }
  return response.status === 204 ? null : response.json();
}

function json(method, value) {
  return { method, body: JSON.stringify(value) };
}

export const api = {
  getBoard: () => request('/board'),
  createSection: (name) => request('/sections', json('POST', { name })),
  createTask: (sectionId, values) => request(`/sections/${sectionId}/tasks`, json('POST', values)),
  updateTask: (taskId, values) => request(`/tasks/${taskId}`, json('PATCH', values)),
  setCompletion: (taskId, completed) => request(`/tasks/${taskId}/completion`, json('PATCH', { completed })),
  moveTask: (taskId, sectionId, position) => request(`/tasks/${taskId}/position`, json('PATCH', { sectionId, position })),
  deleteTask: (taskId) => request(`/tasks/${taskId}`, { method: 'DELETE' }),
};
