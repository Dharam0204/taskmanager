
import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const headers = {
    Authorization: `Bearer ${user.token}`
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/tasks', { headers });
      setTasks(response.data);
    } catch (error) {
      alert('Failed to fetch your tasks.');
    }
  }, [user.token]);

  const fetchAvailableTasks = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/tasks/available', { headers });
      setAvailableTasks(response.data);
    } catch (error) {
      alert('Failed to fetch available requests.');
    }
  }, [user.token]);

  useEffect(() => {
    if (user.role === 'helper') {
      fetchTasks();
      fetchAvailableTasks();
    } else {
      fetchTasks();
    }
  }, [user.role, fetchTasks, fetchAvailableTasks]);

  const acceptTask = async (taskId) => {
    try {
      await axiosInstance.put(`/api/tasks/${taskId}/accept`, {}, { headers });
      await fetchTasks();
      await fetchAvailableTasks();
      alert('Request accepted successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept request.');
    }
  };

  const completeTask = async (taskId) => {
    try {
      await axiosInstance.put(`/api/tasks/${taskId}/complete`, {}, { headers });
      await fetchTasks();
      alert('Request marked as completed.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete request.');
    }
  };

  if (user.role === 'helper') {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Helper Dashboard</h1>

        <h2 className="text-xl font-semibold mb-4">Available Help Requests</h2>

        {availableTasks.length === 0 ? (
          <p className="mb-6">There are currently no available requests.</p>
        ) : (
          availableTasks.map((task) => (
            <div key={task._id} className="bg-white p-4 mb-4 rounded shadow">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-500">
                Requested by: {task.userId?.name || 'Community member'}
              </p>
              <p className="text-sm text-gray-500">
                Deadline: {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : 'Not specified'}
              </p>
              <button
                onClick={() => acceptTask(task._id)}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Accept Request
              </button>
            </div>
          ))
        )}

        <h2 className="text-xl font-semibold mt-8 mb-4">My Accepted Requests</h2>

        {tasks.length === 0 ? (
          <p>You have not accepted any requests yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-sm text-gray-600">
                Status: {task.status}
              </p>

              {task.status === 'accepted' && (
                <button
                  onClick={() => completeTask(task._id)}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />
      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        setEditingTask={setEditingTask}
      />
    </div>
  );
};

export default Tasks;
