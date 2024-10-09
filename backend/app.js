    // backend/app.js
    const express = require('express');
    const cors = require('cors');
    const db = require('./db');

    const app = express();
    app.use(cors());
    app.use(express.json());

    // Obtener todas las tareas
    app.get('/tasks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tasks');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las tareas' });
    }
    });

    // Crear una nueva tarea
 // Crear una nueva tarea
 app.post('/tasks', async (req, res) => {
   const { title, description } = req.body;
   try {
     const [result] = await db.query('INSERT INTO tasks (title, description) VALUES (?, ?)', [title, description]);
     res.json({ id: result.insertId, title, description, status: 'pendiente' });
   } catch (error) {
     console.error('Error al crear la tarea:', error);
     res.status(500).json({ error: 'Error al crear la tarea' });
   }
 });


    // Actualizar el título, descripción y estado de una tarea
    app.put('/tasks/edit/:id', async (req, res) => {
        const { title, description, status } = req.body;
        const { id } = req.params;
        try {
        await db.query('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?', [title, description, status, id]);
        res.json({ message: 'Tarea actualizada' });
        } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la tarea' });
        }
    });
    
    
    

    // Eliminar una tarea
    app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM tasks WHERE id = ?', [id]);
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
    });




    // Iniciar el servidor
    const PORT = 4000;
    app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
