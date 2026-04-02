import api from './api-helper';

const rsvpBasePath = (postId) => `/api/rsvp/${postId}`;

const createRSVP = async (postId, rsvpData) => {
    try {
        return await api.post(rsvpBasePath(postId), rsvpData);
    } catch (error) {
        console.error('Create RSVP error:', error);
        throw error;
    }
};

const getRSVPsByEvent = async (postId) => {
    try {
        return await api.get(rsvpBasePath(postId));
    } catch (error) {
        console.error('Get RSVPs by event error:', error);
        throw error;
    }
};

const updateRSVPStatus = async (postId, status) => {
    try {
        return await api.post(rsvpBasePath(postId), { status });
    } catch (error) {
        console.error('Update RSVP status error:', error);
        throw error;
    }
};

const cancelRSVP = async (postId) => {
    try {
        return await api.delete(rsvpBasePath(postId));
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