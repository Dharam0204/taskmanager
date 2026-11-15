
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const TaskList = ({ tasks, setTasks, setEditingTask }) => {
  const { user } = useAuth();

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });

      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete request.');
    }
  };

  const getStatus = (task) => {
    if (task.status === 'completed' || task.completed) {
      return 'Completed';
    }

    if (task.status === 'accepted' || task.acceptedBy) {
      return 'Accepted by a Helper';
    }

    return 'Available';
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Help Requests</h2>

      {tasks.length === 0 ? (
        <p className="bg-gray-100 p-4 rounded">
          You haven't posted any help requests yet.
        </p>
      ) : (
        tasks.map((task) => {
          const isAvailable =
            !task.acceptedBy &&
            task.status !== 'accepted' &&
            task.status !== 'completed' &&
            !task.completed;

          return (
            <div key={task._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
              <h3 className="font-bold text-lg">{task.title}</h3>

              <p className="mt-2">{task.description}</p>

              <p className="text-sm text-gray-600 mt-2">
                Category: {task.category || 'General Help'}
              </p>

              <p className="text-sm text-gray-600">
                Deadline: {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : 'Not specified'}
              </p>

              <p className="mt-2 font-semibold">
                Status: {getStatus(task)}
              </p>

              {isAvailable && (
                <div className="mt-3">
                  <button
                    onClick={() => setEditingTask(task)}
                    className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TaskList;
