import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";
import AdminRoute from "./components/auth/AdminRoute";
import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";
import Dashboard from "./components/Dashboard";
import TestAPI from "./components/TestAPI";
import Home from "./components/Home";
import PostDetails from "./components/PostDetails";
import Activities from "./components/Activities";
import Profile from "./components/Profile";

function MainRouter() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/test-api" element={<TestAPI />} />
            <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/posts/:postId" element={<PostDetails />} />
            </Route>
            <Route element={<AdminRoute />}>
                <Route path="/activities" element={<Activities />} />
            </Route>
        </Routes>
    );
}

export default MainRouter;