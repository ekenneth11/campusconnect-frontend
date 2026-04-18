import api from './api-helper';
import { authenticate, clearJWT, getCurrentUser } from './auth-helper';

const authBasePath = '/auth';

const register = async (userData) => {
    try {
        const response = await api.post(`${authBasePath}/register`, userData);
        console.log('Register response:', response);
        
        if (response.success) {
            // Auto login after registration
            const loginResponse = await signin({
                email: userData.email,
                password: userData.password
            });
            return loginResponse;
        }
        return response;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

const signin = async (credentials) => {
    try {
        const response = await api.post(`${authBasePath}/login`, credentials);
        console.log('Login response:', response);
        
        if (response.token) {
            authenticate(response.token);
            // Store user info
            if (response.user) {
                sessionStorage.setItem('user', JSON.stringify(response.user));
            }
            return response;
        } else {
            throw new Error('No token received from server');
        }
    } catch (error) {
        console.error('Signin error:', error);
        throw error;
    }
};

const signout = async () => {
    clearJWT();
    sessionStorage.removeItem('user');
    return { success: true };
};

const getProfile = async () => {
    try {
        const userStr = sessionStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('No token');
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                firstName: payload.firstName || 'User',
                lastName: payload.lastName || '',
                username: payload.username,
                email: payload.email,
                role: payload.role || 'student',
                _id: payload.id
            };
        } catch (e) {
            return {
                firstName: 'User',
                lastName: '',
                username: 'user',
                email: '',
                role: 'student'
            };
        }
    } catch (error) {
        console.error('Get profile error:', error);
        throw error;
    }
};

const updateProfile = async (profileData) => {
    const currentUser = getCurrentUser();
    const userId = currentUser?._id || currentUser?.id || currentUser?.userId;
    const endpoints = [
        '/api/users/me',
        '/api/users/profile',
        ...(userId ? [`/api/users/${userId}`] : []),
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
        try {
            const response = await api.put(endpoint, profileData);
            const updatedUser = response?.user || response?.data || response;

            if (updatedUser && typeof updatedUser === 'object') {
                sessionStorage.setItem('user', JSON.stringify(updatedUser));
            }

            return response;
        } catch (error) {
            lastError = error;
        }
    }

    console.error('Update profile error:', lastError);
    throw lastError || new Error('Failed to update profile');
};

// Make sure we export default
const userApi = {
    register,
    signin,
    signout,
    getProfile,
    updateProfile
};

export default userApi;