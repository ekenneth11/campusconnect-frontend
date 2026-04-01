import api from './api-helper';

// Create activity log
const createActivityLog = async (logData) => {
    try {
        return await api.post('/activity-logs', logData);
    } catch (error) {
        console.error('Create activity log error:', error);
        throw error;
    }
};

// Get logs by user
const getLogsByUser = async (userId) => {
    try {
        return await api.get(`/activity-logs/user/${userId}`);
    } catch (error) {
        console.error('Get logs by user error:', error);
        throw error;
    }
};

// Get logs by action
const getLogsByAction = async (action) => {
    try {
        return await api.get(`/activity-logs/action/${action}`);
    } catch (error) {
        console.error('Get logs by action error:', error);
        throw error;
    }
};

// Get all logs (admin only)
const getAllLogs = async () => {
    try {
        return await api.get('/activity-logs');
    } catch (error) {
        console.error('Get all logs error:', error);
        throw error;
    }
};

export default {
    createActivityLog,
    getLogsByUser,
    getLogsByAction,
    getAllLogs
};