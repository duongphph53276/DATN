import { Navigate } from 'react-router-dom';

interface ProtectedShipperRouteProps {
  children: JSX.Element;
}

const ProtectedShipperRoute = ({ children }: ProtectedShipperRouteProps) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "shipper") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedShipperRoute;