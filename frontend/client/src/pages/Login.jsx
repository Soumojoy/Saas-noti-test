// frontend/src/pages/Login.jsx
import { useState, useEffect } from 'react'; // useEffect add kiya
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error, token } = useAuthStore();

useEffect(() => {
  if (token) {
    navigate('/dashboard');
  }
}, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">{error}</div>}
          <div className="rounded-md shadow-sm space-y-4">
            <input
              type="email" required placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
            />
            <input
              type="password" required placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500"
            />
          </div>
          <button type="submit" disabled={isLoading} className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md">
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="text-center text-sm">
          <Link to="/register" className="text-blue-600 hover:text-blue-500">Need an account? Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;