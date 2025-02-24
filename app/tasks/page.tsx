'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(response.data as Task[]);
          } catch (error) {
      console.error('Error fetching tasks', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      const response = await axios.post(
        '/api/tasks',
        { title: newTaskTitle, description: newTaskDescription },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(prevTasks => [...prevTasks, response.data as Task]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (error) {
      console.error('Error creating task', error);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = { ...task, isComplete: !task.isComplete };
      await axios.put(
        `/api/tasks/${task.id}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === task.id ? { ...t, isComplete: updatedTask.isComplete } : t
        )
      );
    } catch (error) {
      console.error('Error toggling task completion', error);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task', error);
    }
  };

  const handleEditTask = async (taskId: number) => {
    try {
      const updatedTask = { title: editTitle, description: editDescription };
      await axios.put(
        `/api/tasks/${taskId}`,
        updatedTask,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === taskId ? { ...t, title: editTitle, description: editDescription } : t
        )
      );
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task', error);
    }
  };

  const refreshTasks = () => {
    fetchTasks();
  };

  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <span>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
                <button onClick={() => handleEditTask(task.id)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </span>
            ) : (
              <span style={{ textDecoration: task.isComplete ? 'line-through' : 'none' }}>
                {task.title} - {task.description}
              </span>
            )}
            <button onClick={() => handleToggleComplete(task)}>
              {task.isComplete ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
            {editingTaskId !== task.id && (
              <>
                <button onClick={() => {
                  setEditingTaskId(task.id);
                  setEditTitle(task.title);
                  setEditDescription(task.description || '');
                }}>
                  Edit 
                </button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          placeholder="New task title"
          value={newTaskTitle}
          onChange={e => setNewTaskTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="New task description"
          value={newTaskDescription}
          onChange={e => setNewTaskDescription(e.target.value)}
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>
    </div>
  );
};

export default TaskListPage;
