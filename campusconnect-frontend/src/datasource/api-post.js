import api from './api-helper';

const createPost = async (postData) => {
    try {
        return await api.post('/posts', postData);
    } catch (error) {
        console.error('Create post error:', error);
        throw error;
    }
};

const getAllPosts = async () => {
    try {
        return await api.get('/posts');
    } catch (error) {
        console.error('Get all posts error:', error);
        throw error;
    }
};

const getPostById = async (postId) => {
    try {
        return await api.get(`/posts/${postId}`);
    } catch (error) {
        console.error('Get post by ID error:', error);
        throw error;
    }
};

const updatePost = async (postId, postData) => {
    try {
        return await api.put(`/posts/${postId}`, postData);
    } catch (error) {
        console.error('Update post error:', error);
        throw error;
    }
};

const deletePost = async (postId) => {
    try {
        return await api.delete(`/posts/${postId}`);
    } catch (error) {
        console.error('Delete post error:', error);
        throw error;
    }
};

export default {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};