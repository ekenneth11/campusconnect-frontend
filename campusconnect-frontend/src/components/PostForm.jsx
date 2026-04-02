

import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

function PostForm({ showPostModal, handleHide, currentPost, setCurrentPost, handleSubmit, user, handleChange }) {
    const [title, setTitle] = useState("Create a post");

    useEffect(() => {
        if (currentPost._id) {
            setTitle("Edit post");
        } else {
            setTitle("Create a post");
        }
    }, [currentPost]);

    return (
        <>
            {/* Post modal */}
            <Modal show={showPostModal} onHide={handleHide} size="xl" scrollable centered>
                <Modal.Header className="border-bottom-0 pb-2" closeButton>
                    <Modal.Title className="w-100 text-center fs-2 fw-semibold">{title}</Modal.Title>

                </Modal.Header>
                <Modal.Body className="pt-0">
                    <div className="border-top pt-4">
                        <form id="postForm" className="px-3 pb-2" onSubmit={handleSubmit}>
                            <div className="d-flex align-items-center mb-4 gap-3">
                                <div className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center fw-bold" style={{ width: '42px', height: '42px' }}>
                                    {(user?.firstName?.[0] || 'U').toUpperCase()}
                                </div>
                                <div>
                                    <p className="mb-0 fw-semibold fs-5">{user.firstName} {user.lastName}</p>
                                    <p className="mb-0 text-secondary fs-4">{user.role}</p>
                                </div>
                            </div>

                            <div className="row g-3 mb-3">
                                <div className="col-md-8">
                                    <input
                                        id="titleTextField"
                                        name="title"
                                        className="form-control rounded-4 py-3 px-3 fs-4"
                                        placeholder="Title"
                                        value={currentPost.title || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="col-md-4">
                                    <select
                                        id="categorySelect"
                                        name="category"
                                        className="form-select rounded-4 py-3 px-3 fs-4"
                                        value={currentPost.category || ''}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Category</option>
                                        <option value="event">Event</option>
                                        <option value="announcement">Announcement</option>
                                        <option value="discussion">Discussion</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <textarea
                                    id="contentTextArea"
                                    name="content"
                                    className="form-control rounded-4 p-3 fs-5"
                                    rows="6"
                                    placeholder="Description of the post"
                                    value={currentPost.content || ''}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-md-4">
                                    <input
                                        id="eventDateInput"
                                        type="date"
                                        name="eventDate"
                                        className="form-control rounded-4 py-3 px-3 fs-5"
                                        value={currentPost.eventDate || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-8">
                                    <input
                                        id="locationInput"
                                        name="location"
                                        className="form-control rounded-4 py-3 px-3 fs-5"
                                        placeholder="Location"
                                        value={currentPost.location || ''}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-dark w-100 rounded-4 py-3 fs-4">
                                Post
                            </button>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default PostForm;