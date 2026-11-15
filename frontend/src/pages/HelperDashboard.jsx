
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const HelperDashboard = () => {
  const { user } = useAuth();
  const [availableTasks, setAvailableTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const headers = {
    Authorization: `Bearer ${user.token}`
  };

  const fetchTasks = useCallback(async () => {
    try {
      const [availableResponse, myTasksResponse] = await Promise.all([
        axiosInstance.get('/api/tasks/available', { headers }),
        axiosInstance.get('/api/tasks', { headers })
      ]);

      setAvailableTasks(availableResponse.data);
      setMyTasks(myTasksResponse.data);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load help requests.');
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAccept = async (taskId) => {
    try {
      await axiosInstance.put(
        `/api/tasks/${taskId}/accept`,
        {},
        { headers }
      );

      alert('You have successfully accepted this request.');
      await fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept request.');
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await axiosInstance.put(
        `/api/tasks/${taskId}/complete`,
        {},
        { headers }
      );

      alert('Request marked as completed.');
      await fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to complete request.');
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading requests...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Helper Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Browse community requests and offer your assistance.
      </p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">
          Available Help Requests
        </h2>

        {availableTasks.length === 0 ? (
          <p className="bg-gray-100 p-4 rounded">
            There are currently no available requests.
          </p>
        ) : (
          availableTasks.map((task) => (
            <div key={task._id} className="bg-white p-5 mb-4 rounded shadow">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <p className="mt-2">{task.description}</p>
              <p className="text-sm mt-2">
                Category: {task.category || 'General Help'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Requested by: {task.userId?.name || 'Community member'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Deadline: {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : 'Not specified'}
              </p>

              <button
                onClick={() => handleAccept(task._id)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                Accept Request
              </button>
            </div>
          ))
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">
          My Accepted Requests
        </h2>

        {myTasks.length === 0 ? (
          <p className="bg-gray-100 p-4 rounded">
            You haven't accepted any requests yet.
          </p>
        ) : (
          myTasks.map((task) => (
            <div key={task._id} className="bg-white p-5 mb-4 rounded shadow">
              <h3 className="text-xl font-bold">{task.title}</h3>
              <p className="mt-2">{task.description}</p>
              <p className="text-sm mt-2">
                Category: {task.category || 'General Help'}
              </p>
              <p className="text-sm mt-1">
                Status: {task.status || 'available'}
              </p>

              {task.status !== 'completed' && !task.completed && (
                <button
                  onClick={() => handleComplete(task._id)}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Mark as Completed
                </button>
              )}

              {(task.status === 'completed' || task.completed) && (
                <p className="mt-4 text-green-700 font-semibold">
                  Completed
                </p>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default HelperDashboard;
