//this will filter if the current user is authenticated and if not, it will redirect to the login page

import { useLocation, Navigate } from "react-router-dom";
import { isAuthenticated } from './auth-helper'

function PrivateRoute({ children }) {
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location.pathname }} />;
    }

    return children;
}

export default PrivateRoute;