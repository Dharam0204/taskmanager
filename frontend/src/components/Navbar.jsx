
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-green-700 text-white p-4 flex justify-between items-center">
      <Link to="/tasks" className="text-xl font-bold">
        Neighborhood Help Network
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="hidden sm:inline text-sm">
              {user.name} ({user.role === 'helper' ? 'Helper' : 'Help Seeker'})
            </span>

            <Link to="/tasks">Dashboard</Link>
            <Link to="/profile">Profile</Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link
              to="/register"
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
