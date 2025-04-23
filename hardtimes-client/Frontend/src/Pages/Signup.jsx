import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Components/Auth_context';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Signup failed');
      }

      login(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#B0C4DE] min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#5A4FCF]">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#5A4FCF] text-white py-2 rounded hover:bg-[#4A3F9C] transition"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-[#5A4FCF] hover:text-[#4A3F9C]"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
