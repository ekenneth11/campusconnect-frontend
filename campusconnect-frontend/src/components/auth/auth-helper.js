//this helps to validate the current token and check if the user is authenticated

import {jwtDecode} from 'jwt-decode';

const authenticate = (token, cb) => {
    if(typeof window !== "undefined"){
        sessionStorage.setItem("token", token);
        
        let payload = jwtDecode(token);
        //placeholder (needs to be change in the future)
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
    return !!sessionStorage.getItem("token"); //checks if the token exists and returns true or false
}

//if the user logs out, we need to clear the token and username from session storage
const clearJWT = () => {
    if (typeof window !== "undefined"){
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("username");
    }   
}

export {authenticate, getToken, isAuthenticated, clearJWT};