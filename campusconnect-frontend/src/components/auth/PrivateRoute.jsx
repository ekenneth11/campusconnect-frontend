import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from '../../api/auth-helper';

function PrivateRoute() {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;