import api from './api-helper';

const createPost = async (postData) => {
    try {
        return await api.post('/api/posts', postData);
    } catch (error) {
        console.error('Create post error:', error);
        throw error;
    }
};

const getAllPosts = async () => {
    try {
        const response = await api.get('/api/posts');
        return response;
    } catch (error) {
        console.error('Get all posts error:', error);
        throw error;
    }
};

const getPostById = async (postId) => {
    try {
        return await api.get(`/api/posts/${postId}`);
    } catch (error) {
        console.error('Get post by ID error:', error);
        throw error;
    }
};

const updatePost = async (postId, postData) => {
    try {
        return await api.put(`/api/posts/${postId}`, postData);
    } catch (error) {
        console.error('Update post error:', error);
        throw error;
    }
};

const deletePost = async (postId) => {
    try {
        return await api.delete(`/api/posts/${postId}`);
    } catch (error) {
        console.error('Delete post error:', error);
        throw error;
    }
};

const postApi = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};

export default postApi;