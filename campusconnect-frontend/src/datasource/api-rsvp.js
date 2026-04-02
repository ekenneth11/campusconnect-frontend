import api from './api-helper';

const createRSVP = async (postId, rsvpData) => {
    try {
        return await api.post(`/api/posts/${postId}/rsvp`, rsvpData);
    } catch (error) {
        console.error('Create RSVP error:', error);
        throw error;
    }
};

const getRSVPsByEvent = async (postId) => {
    try {
        return await api.get(`/api/posts/${postId}/rsvp`);
    } catch (error) {
        console.error('Get RSVPs by event error:', error);
        throw error;
    }
};

const updateRSVPStatus = async (postId, status) => {
    try {
        return await api.post(`/api/posts/${postId}/rsvp`, { status });
    } catch (error) {
        console.error('Update RSVP status error:', error);
        throw error;
    }
};

const cancelRSVP = async (postId) => {
    try {
        return await api.delete(`/api/posts/${postId}/rsvp`);
    } catch (error) {
        console.error('Cancel RSVP error:', error);
        throw error;
    }
};

export default {
    createRSVP,
    getRSVPsByEvent,
    updateRSVPStatus,
    cancelRSVP
};