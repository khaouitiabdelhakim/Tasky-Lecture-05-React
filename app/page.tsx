"use client"

import { useState, useEffect } from 'react';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const Home = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState<string>('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (newTaskText.trim()) {
      try {
        const res = await fetch('http://localhost:3001/api/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ text: newTaskText })
        });
        if (!res.ok) {
          throw new Error('Failed to add task');
        }
        const data: Task = await res.json();
        setTasks([...tasks, data]);
        setNewTaskText('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const updateTask = async (id: number) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
    const updatedTask = { ...taskToUpdate, completed: !taskToUpdate.completed };
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedTask)
      });
      if (!res.ok) {
        throw new Error('Failed to update task');
      }
      await res.json();
      const updatedTasks = tasks.map(task => {
        if (task.id === id) {
          return updatedTask;
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        throw new Error('Failed to delete task');
      }
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container mt-5">
      <Head>
        <title>Tasky</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Tasky</h1>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="Enter task" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" onClick={addTask}>Add Task</button>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-md-6">
          <h3>Tasks</h3>
          <ul className="list-group">
            {tasks.map(task => (
              <li key={task.id} className="list-group-item">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" checked={task.completed} onChange={() => updateTask(task.id)} />
                  <label className="form-check-label" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.text}</label>
                  <button className="btn btn-danger btn-sm float-right ml-2" onClick={() => deleteTask(task.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
