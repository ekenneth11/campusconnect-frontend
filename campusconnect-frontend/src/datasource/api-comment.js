import api from './api-helper';

const createComment = async (commentData) => {
    try {
        return await api.post('/comments', commentData);
    } catch (error) {
        console.error('Create comment error:', error);
        throw error;
    }
};

const getCommentsByPost = async (postId) => {
    try {
        return await api.get(`/comments/post/${postId}`);
    } catch (error) {
        console.error('Get comments by post error:', error);
        throw error;
    }
};

const updateComment = async (commentId, commentData) => {
    try {
        return await api.put(`/comments/${commentId}`, commentData);
    } catch (error) {
        console.error('Update comment error:', error);
        throw error;
    }
};

const deleteComment = async (commentId) => {
    try {
        return await api.delete(`/comments/${commentId}`);
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