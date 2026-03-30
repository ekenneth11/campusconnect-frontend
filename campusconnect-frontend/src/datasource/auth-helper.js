import { jwtDecode } from 'jwt-decode';

const authenticate = (token, cb) => {
    if(typeof window !== "undefined"){
        sessionStorage.setItem("token", token);
        
        let payload = jwtDecode(token);
        sessionStorage.setItem("username", payload.username);
    }
    cb();
}

const getToken = () =>{
    if (typeof window === "undefined"){
        return false;
    }
    return sessionStorage.getItem("token");
}

const isAuthenticated = () => {
    if (typeof window === "undefined"){
        return false;
    }
    return !!sessionStorage.getItem("token");
}

const clearJWT = () => {
    if (typeof window !== "undefined"){
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
    }   
}

export {authenticate, getToken, isAuthenticated, clearJWT};