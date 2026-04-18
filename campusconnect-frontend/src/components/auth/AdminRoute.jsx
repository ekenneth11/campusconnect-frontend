import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { isAdmin, isAuthenticated } from '../../datasource/auth-helper';

function AdminRoute() {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
