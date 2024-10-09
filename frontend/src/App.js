import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Notiflix from 'notiflix';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pendiente' });
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      setTasks(response.data);
    } catch (error) {
      Notiflix.Notify.failure("Error fetching tasks: " + error.message);
      console.error("Error fetching tasks", error);
    }
  };

  const createTask = async () => {
    if (!newTask.title || !newTask.description) {
      Notiflix.Notify.warning("Please fill in all fields.");
      return;
    }

    try {
      await axios.post('http://localhost:4000/tasks', newTask);
      setNewTask({ title: '', description: '', status: 'pendiente' });
      fetchTasks();
      Notiflix.Notify.success("Task created successfully!");
    } catch (error) {
      Notiflix.Notify.failure("Error creating task: " + error.message);
      console.error("Error creating task", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/tasks/${id}`);
      fetchTasks();
      Notiflix.Notify.success("Task deleted successfully!");
    } catch (error) {
      Notiflix.Notify.failure("Error deleting task: " + error.message);
      console.error("Error deleting task", error);
    }
  };

  const startEditingTask = (task) => {
    setEditingTask(task);
  };

  const editTask = async () => {
    if (!editingTask.title || !editingTask.description || !editingTask.status) {
      Notiflix.Notify.warning("Please fill in all fields.");
      return;
    }

    try {
      await axios.put(`http://localhost:4000/tasks/edit/${editingTask.id}`, {
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
      });
      setEditingTask(null);
      fetchTasks();
      Notiflix.Notify.success("Task updated successfully!");
    } catch (error) {
      Notiflix.Notify.failure("Error updating task: " + error.message);
      console.error("Error editing task", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-black bg-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Lista de Tareas</h1>

      {/* Formulario para crear nueva tarea */}
      <div className="w-full max-w-3xl bg-gray-100 rounded-lg p-6 mb-8 shadow-lg mx-auto">
        <h2 className="text-2xl mb-4 text-center">Crear Nueva Tarea</h2>
        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Título"
            className="p-2 border border-gray-300 rounded w-full bg-gray-200 text-black"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Descripción"
            className="p-2 border border-gray-300 rounded w-full bg-gray-200 text-black"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <div className="flex justify-center">
            <button 
              className="p-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white rounded flex items-center"
              onClick={createTask}
            >
              <i className="fas fa-plus-circle mr-2"></i> Crear Tarea
            </button>
          </div>
        </div>
      </div>

      {/* Lista de tareas */}
      <div className="space-y-4 w-full max-w-3xl">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className={`p-4 border rounded-lg shadow-md ${task.status === 'completada' ? 'bg-green-200 border-green-500' : 'bg-blue-200 border-blue-500'}`}
          >
            <h3 className="text-xl font-semibold">{task.title}</h3>
            <p>{task.description}</p>
            <p className="text-sm text-gray-600">Estado: <span className={task.status === 'pendiente' ? 'text-blue-600' : 'text-green-600'}>{task.status}</span></p>
            <div className="mt-2 flex justify-between">
              <button
                className="p-2 bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white rounded flex items-center"
                onClick={() => deleteTask(task.id)}
              >
                <i className="fas fa-trash-alt mr-2"></i> Eliminar
              </button>
              <button
                className="p-2 bg-gray-600 hover:bg-gray-700 transition-colors duration-300 rounded flex items-center"
                onClick={() => startEditingTask(task)}
              >
                <i className="fas fa-edit mr-2"></i> Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de edición */}
      {editingTask && (
        <div className="mt-6 w-full max-w-3xl bg-gray-100 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl mb-4 text-center">Editando Tarea</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              className="p-2 border border-gray-300 rounded w-full bg-gray-200 text-black"
              value={editingTask.title}
              onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
            />
            <input
              type="text"
              className="p-2 border border-gray-300 rounded w-full bg-gray-200 text-black"
              value={editingTask.description}
              onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
            />
            <select
              className="p-2 border border-gray-300 rounded w-full bg-gray-200 text-black"
              value={editingTask.status}
              onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
            >
              <option value="pendiente">Pendiente</option>
              <option value="completada">Completada</option>
            </select>
            <div className="flex justify-between col-span-1 sm:col-span-3">
              <button 
                className="p-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-300 text-white rounded flex items-center"
                onClick={editTask}
              >
                <i className="fas fa-save mr-2"></i> Guardar Cambios
              </button>
              <button 
                className="p-2 bg-yellow-600 hover:bg-yellow-700 transition-colors duration-300 text-white rounded flex items-center"
                onClick={() => setEditingTask(null)}
              >
                <i className="fas fa-times mr-2"></i> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
