//this will be all the routers will be defined here and then imported in App.jsx
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";

import SignIn from "./components/auth/SignIn";
import Register from "./components/auth/Register";

function MainRouter(){
    return (
        <>
        <Routes>
            <Route exact path="/signin" element={<SignIn />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/placeholder" element={
                <PrivateRoute>
                    //this will be the home page component
                </PrivateRoute>
                } />
        </Routes>
        </>
    )
}

export default MainRouter;