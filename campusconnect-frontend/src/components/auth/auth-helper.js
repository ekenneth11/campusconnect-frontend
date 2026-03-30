import { jwtDecode } from 'jwt-decode';

const authenticate = (token, cb) => {
    if (typeof window !== "undefined") {
        sessionStorage.setItem("token", token);
        
        try {
            let payload = jwtDecode(token);
            sessionStorage.setItem("username", payload.username || payload.email);
            sessionStorage.setItem("userId", payload.userId || payload._id);
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }
    if (cb) cb();
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
    const token = sessionStorage.getItem("token");
    if (!token) return false;
    
    try {
        const decoded = jwtDecode(token);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            clearJWT();
            return false;
        }
        return true;
    } catch (error) {
        return false;
    }
}

const clearJWT = () => {
    if (typeof window !== "undefined") {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("email");
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