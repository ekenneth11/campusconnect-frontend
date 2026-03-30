import { jwtDecode } from 'jwt-decode';

const authenticate = (token, cb) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem("token", token);
        
        try {
            let payload = jwtDecode(token);
            sessionStorage.setItem("username", payload.username);
            sessionStorage.setItem("userId", payload.id);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    if (cb && typeof cb === 'function') {
        cb();
    }
}

const getToken = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return sessionStorage.getItem("token");
}

const isAuthenticated = () => {
    if (typeof window === "undefined") {
        return false;
    }
    return !!sessionStorage.getItem("token");
}

const clearJWT = () => {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");
    }   
}

const getCurrentUser = () => {
    if (typeof window === "undefined") return null;
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (error) {
        return null;
    }
}

export { authenticate, getToken, isAuthenticated, clearJWT, getCurrentUser };