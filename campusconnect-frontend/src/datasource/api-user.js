import api from './api-helper';
import { authenticate, clearJWT } from './auth-helper';

const register = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        if (response.token) {
            authenticate(response.token);
        }
        return response;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

const signin = async (credentials) => {
    try {
        const response = await api.post('/users/signin', credentials);
        if (response.token) {
            authenticate(response.token);
        }
        return response;
    } catch (error) {
        console.error('Signin error:', error);
        throw error;
    }
};

const signout = async () => {
    clearJWT();
    return { success: true };
};

const getProfile = async () => {
    try {
        return await api.get('/users/profile');
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
};

export default {
    register,
    signin,
    signout,
    getProfile
};