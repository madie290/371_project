import { createContext, useContext, useEffect, useState } from 'react';
import API from '../Api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    API.get('/api/user')
      .then((res) => {
        if (res.data.user) setUser(res.data.user);
      })
      .catch((err) =>
        console.log('Auth check failed (no session):', err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  // Signup new user
  const signup = async ({ email, username, password }) => {
    const res = await API.post('/api/signup', { email, username, password });
    if (res.data.success) {
      setUser(res.data.user);
    }
    return res.data;
  };

  // Login existing user
  const login = async ({ username, password }) => {
    const res = await API.post('/api/login', { username, password });
    if (res.data.success) {
      setUser(res.data.user);
    }
    return res.data;
  };

  // Logout
  const logout = async () => {
    try {
      await API.post('/api/logout');
      setUser(null);
    } catch (err) {
      console.log('Logout failed:', err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
