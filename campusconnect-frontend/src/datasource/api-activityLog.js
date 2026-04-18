import api from './api-helper';

const activityBasePath = '/api/activities';

// Create activity log
const createActivityLog = async (logData) => {
    try {
        return await api.post(activityBasePath, logData);
    } catch (error) {
        console.error('Create activity log error:', error);
        throw error;
    }
};

// Get activities for current authenticated user
const getMyActivities = async () => {
    try {
        return await api.get(`${activityBasePath}/me`);
    } catch (error) {
        console.error('Get my activities error:', error);
        throw error;
    }
};

// Get activities for a specific user
const getUserActivities = async (userId) => {
    try {
        return await api.get(`${activityBasePath}/user/${userId}`);
    } catch (error) {
        console.error('Get user activities error:', error);
        throw error;
    }
};

// Get all activities (admin only)
const getAllActivities = async () => {
    try {
        return await api.get(activityBasePath);
    } catch (error) {
        console.error('Get all activities error:', error);
        throw error;
    }
};

// Backward-compatible aliases used by existing frontend code.
const getLogsByUser = getUserActivities;
const getAllLogs = getAllActivities;

// Backend does not expose an action-filter endpoint; filter client-side from all activities.
const getLogsByAction = async (action) => {
    const response = await getAllActivities();
    const list = Array.isArray(response)
        ? response
        : response?.activities || response?.data || response?.logs || response?.activityLogs || [];

    return {
        success: true,
        count: list.filter((item) => item?.action === action).length,
        activities: list.filter((item) => item?.action === action),
    };
};

export default {
    createActivityLog,
    getMyActivities,
    getUserActivities,
    getAllActivities,
    getLogsByUser,
    getLogsByAction,
    getAllLogs
};