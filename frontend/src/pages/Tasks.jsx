
import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import HelperDashboard from './HelperDashboard';
import { useAuth } from '../context/AuthContext';

const Tasks = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const isHelper = user?.role === 'helper';

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || isHelper) {
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get('/api/tasks', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });

        setTasks(response.data);
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to fetch requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user, isHelper]);

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  if (isHelper) {
    return <HelperDashboard />;
  }

  if (loading) {
    return <p className="text-center mt-10">Loading your requests...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Help Seeker Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Create a request and find support from your community.
      </p>

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
