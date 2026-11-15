
import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const headers = {
    Authorization: `Bearer ${user.token}`,
  };

  const fetchTasks = useCallback(async () => {
    try {
      setError('');
      setLoading(true);

      if (user.role === 'helper') {
        const [availableResponse, acceptedResponse] = await Promise.all([
          axiosInstance.get('/api/tasks/available', { headers }),
          axiosInstance.get('/api/tasks', { headers }),
        ]);

        setAvailableTasks(availableResponse.data);
        setTasks(acceptedResponse.data);
      } else {
        const response = await axiosInstance.get('/api/tasks', { headers });
        setTasks(response.data);
      }
    } catch (err) {
      setError('Unable to load requests. Please refresh the page or log in again.');
    } finally {
      setLoading(false);
    }
  }, [user.token, user.role]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const acceptTask = async (taskId) => {
    try {
      await axiosInstance.put(`/api/tasks/${taskId}/accept`, {}, { headers });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to accept this request.');
    }
  };

  const completeTask = async (taskId) => {
    try {
      await axiosInstance.put(`/api/tasks/${taskId}/complete`, {}, { headers });
      await fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to complete this request.');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No deadline specified';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading requests...</div>;
  }

  if (user.role === 'helper') {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Helper Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Browse community requests and help people in your neighbourhood.
        </p>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <h2 className="text-xl font-bold mb-4">Available Help Requests</h2>

        {availableTasks.length === 0 ? (
          <p className="text-gray-600 mb-6">There are currently no available requests.</p>
        ) : (
          availableTasks.map((task) => (
            <div key={task._id} className="bg-white border p-4 mb-4 rounded shadow">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="my-2">{task.description}</p>
              <p className="text-sm text-gray-600">
                Requested by: {task.userId?.name || 'Community member'}
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Deadline: {formatDate(task.deadline)}
              </p>
              <button
                onClick={() => acceptTask(task._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Accept Request
              </button>
            </div>
          ))
        )}

        <h2 className="text-xl font-bold mt-8 mb-4">My Accepted Requests</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-600">You have not accepted any requests yet.</p>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p className="my-2">{task.description}</p>
              <p className="text-sm text-gray-600">
                Deadline: {formatDate(task.deadline)}
              </p>
              <p className="text-sm font-semibold mt-2 mb-3">
                Status: {task.status}
              </p>

              {task.status === 'accepted' && (
                <button
                  onClick={() => completeTask(task._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded"
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
      {error && (
        <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
      )}

      <TaskForm
        tasks={tasks}
        setTasks={setTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
      />

      <h2 className="text-xl font-bold mb-4">My Help Requests</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-600">You have not created any help requests yet.</p>
      ) : (
        <TaskList
          tasks={tasks}
          setTasks={setTasks}
          setEditingTask={setEditingTask}
        />
      )}
    </div>
  );
};

export default Tasks;
