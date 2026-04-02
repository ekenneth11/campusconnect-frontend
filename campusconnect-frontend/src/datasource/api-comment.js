import api from './api-helper';

const commentBasePath = (postId) => `/api/comments/${postId}`;

const createComment = async (postId, commentData) => {
    try {
        return await api.post(commentBasePath(postId), commentData);
    } catch (error) {
        console.error('Create comment error:', error);
        throw error;
    }
};

const getCommentsByPost = async (postId) => {
    try {
        return await api.get(commentBasePath(postId));
    } catch (error) {
        console.error('Get comments by post error:', error);
        throw error;
    }
};

const updateComment = async (postId, commentId, commentData) => {
    try {
        return await api.put(`${commentBasePath(postId)}/${commentId}`, commentData);
    } catch (error) {
        console.error('Update comment error:', error);
        throw error;
    }
};

const deleteComment = async (postId, commentId) => {
    try {
        return await api.delete(`${commentBasePath(postId)}/${commentId}`);
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