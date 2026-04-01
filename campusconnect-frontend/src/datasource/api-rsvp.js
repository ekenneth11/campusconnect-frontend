import api from './api-helper';

const createRSVP = async (rsvpData) => {
    try {
        return await api.post('/rsvps', rsvpData);
    } catch (error) {
        console.error('Create RSVP error:', error);
        throw error;
    }
};

const getRSVPsByEvent = async (eventId) => {
    try {
        return await api.get(`/rsvps/event/${eventId}`);
    } catch (error) {
        console.error('Get RSVPs by event error:', error);
        throw error;
    }
};

const getRSVPsByUser = async (userId) => {
    try {
        return await api.get(`/rsvps/user/${userId}`);
    } catch (error) {
        console.error('Get RSVPs by user error:', error);
        throw error;
    }
};

const updateRSVPStatus = async (rsvpId, status) => {
    try {
        return await api.put(`/rsvps/${rsvpId}`, { status });
    } catch (error) {
        console.error('Update RSVP status error:', error);
        throw error;
    }
};

const cancelRSVP = async (rsvpId) => {
    try {
        return await api.delete(`/rsvps/${rsvpId}`);
    } catch (error) {
        console.error('Cancel RSVP error:', error);
        throw error;
    }
};

export default {
    createRSVP,
    getRSVPsByEvent,
    getRSVPsByUser,
    updateRSVPStatus,
    cancelRSVP
};