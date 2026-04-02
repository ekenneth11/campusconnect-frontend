import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";
import Dashboard from "./components/Dashboard";
import TestAPI from "./components/TestAPI";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";

function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test-api" element={<TestAPI />} />
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/posts/:postId" element={<PostDetails />} />
            </Route>
        </Routes>
    );
}

export default MainRouter;