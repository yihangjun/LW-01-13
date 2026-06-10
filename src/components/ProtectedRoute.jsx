import { Navigate, useLocation } from 'react-router-dom';
import { useMallAuth } from '../hooks/useMallAuth';

export default function ProtectedRoute({ children }) {
  const { user } = useMallAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
