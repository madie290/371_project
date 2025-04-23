import { Navigate } from 'react-router-dom';
import { useAuth } from '../Components/Auth_context';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
