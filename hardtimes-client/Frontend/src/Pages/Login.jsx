import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/Auth_context';
import API from '../Api'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await API.post('/api/login', { username, password });

      if (response.data.success) {
        await login({ username, password }); // optional, based on your auth logic
        navigate('/');
      } else {
        setError(response.data.error || 'An error occurred.');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
    }
  };

  return (
    <div className="bg-[#B0C4DE] min-h-screen flex flex-col justify-center items-center">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold text-[#5A4FCF] mb-8 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-lg font-medium text-[#5A4FCF]">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-[#5A4FCF] rounded-xl mt-2"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-medium text-[#5A4FCF]">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-[#5A4FCF] rounded-xl mt-2"
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="text-red-500 text-center mt-2">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#5A4FCF] text-white py-3 rounded-xl hover:bg-[#4A3F9C] transition"
          >
            Log In
          </button>
        </form>

        <div className="mt-4 text-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="text-[#5A4FCF] hover:text-[#4A3F9C]"
          >
            Back to Home
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="text-[#5A4FCF] hover:text-[#4A3F9C]"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
