
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskForm = ({ tasks, setTasks, editingTask, setEditingTask }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General Help',
    deadline: ''
  });

  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        category: editingTask.category || 'General Help',
        deadline: editingTask.deadline
          ? new Date(editingTask.deadline).toISOString().split('T')[0]
          : ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'General Help',
        deadline: ''
      });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTask) {
        const response = await axiosInstance.put(
          `/api/tasks/${editingTask._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` }
          }
        );

        setTasks(tasks.map((task) =>
          task._id === response.data._id ? response.data : task
        ));
      } else {
        const response = await axiosInstance.post(
          '/api/tasks',
          formData,
          {
            headers: { Authorization: `Bearer ${user.token}` }
          }
        );

        setTasks([...tasks, response.data]);
      }

      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        category: 'General Help',
        deadline: ''
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save request.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">
        {editingTask ? 'Edit Help Request' : 'Create a Help Request'}
      </h1>

      <input
        type="text"
        placeholder="What help do you need?"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <textarea
        placeholder="Describe the help you need"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
        rows="3"
      />

      <label className="block mb-2 font-medium">Help Category</label>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Gardening">Gardening</option>
        <option value="Shopping">Shopping</option>
        <option value="Transport">Transport</option>
        <option value="General Help">General Help</option>
      </select>

      <label className="block mb-2 font-medium">Deadline (optional)</label>
      <input
        type="date"
        value={formData.deadline}
        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {editingTask ? 'Update Request' : 'Post Help Request'}
      </button>

      {editingTask && (
        <button
          type="button"
          onClick={() => setEditingTask(null)}
          className="w-full mt-2 bg-gray-200 text-gray-800 p-2 rounded"
        >
          Cancel Editing
        </button>
      )}
    </form>
  );
};

export default TaskForm;
