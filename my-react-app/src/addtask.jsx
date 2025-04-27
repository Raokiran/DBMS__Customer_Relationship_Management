import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddTask() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clientId, projectId } = location.state || {};

  const userId = localStorage.getItem('user_id'); // Get user_id from local storage

  const [task, setTask] = useState({
    task_id: '',
    project_id: projectId || '',
    assigned_to: userId || '', // Set assigned_to to user_id
    title: '',
    description: '',
    status: 'Open',
    due_date: ''
  });

  useEffect(() => {
    const randomTaskId = 'TAS' + Math.floor(100000 + Math.random() * 900000);
    setTask((prev) => ({ ...prev, task_id: randomTaskId }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/addtask', task);
      alert('Task added successfully');
      navigate('/viewdetails', { state: { userId, clientId } });
    } catch (error) {
      console.error(error);
      alert('Error adding task');
    }
  };

  return (
    <div>
      <h2>Add Task</h2>
      <p><strong>User ID:</strong> {userId}</p>
      <p><strong>Client ID:</strong> {clientId}</p>
      <p><strong>Project ID:</strong> {projectId}</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Task ID: </label>
          <input type="text" value={task.task_id} name="task_id" readOnly />
        </div>
        {/* Removed the input for assigned_to */}
        <div>
          <label>Title: </label>
          <input type="text" name="title" value={task.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Description: </label>
          <textarea name="description" value={task.description} onChange={handleChange} required />
        </div>
        <div>
          <label>Status: </label>
          <select name="status" value={task.status} onChange={handleChange}>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div>
          <label>Due Date: </label>
          <input type="date" name="due_date" value={task.due_date} onChange={handleChange} required />
        </div>
        <button type="submit">Add Task</button>
      </form>

      <button onClick={() => navigate('/viewdetails', { state: { userId, clientId } })}>Back</button>
    </div>
  );
}

export default AddTask;
