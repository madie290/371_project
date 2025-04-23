import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //Check for existing session
  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Not authenticated');
        return res.json();
      })
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) =>
        console.log('Auth check failed (no session):', err.message)
      )
      .finally(() => setLoading(false));
  }, []);

  //Signup new user
  const signup = async ({ email, username, password }) => {
    const res = await fetch('http://localhost:5000/api/signup', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  //Login existing user
  const login = async ({ username, password }) => {
    const res = await fetch('http://localhost:5000/api/login', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
    }
    return data;
  };

  //Logout
  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (err) {
      console.log('Logout failed:', err.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
