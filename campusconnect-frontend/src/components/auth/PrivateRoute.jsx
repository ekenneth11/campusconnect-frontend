import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from '../../datasource/auth-helper';

function PrivateRoute() {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
    }

    return <Outlet />;
}

export default PrivateRoute;