import api from './api-helper';

const createComment = async (postId, commentData) => {
    try {
        return await api.post(`/api/posts/${postId}/comments`, commentData);
    } catch (error) {
        console.error('Create comment error:', error);
        throw error;
    }
};

const getCommentsByPost = async (postId) => {
    try {
        return await api.get(`/api/posts/${postId}/comments`);
    } catch (error) {
        console.error('Get comments by post error:', error);
        throw error;
    }
};

const updateComment = async (postId, commentId, commentData) => {
    try {
        return await api.put(`/api/posts/${postId}/comments/${commentId}`, commentData);
    } catch (error) {
        console.error('Update comment error:', error);
        throw error;
    }
};

const deleteComment = async (postId, commentId) => {
    try {
        return await api.delete(`/api/posts/${postId}/comments/${commentId}`);
    } catch (error) {
        console.error('Delete comment error:', error);
        throw error;
    }
};

export default {
    createComment,
    getCommentsByPost,
    updateComment,
    deleteComment
};