//this will be all the routers will be defined here and then imported in App.jsx
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/auth/PrivateRoute";

function MainRouter(){
    return (
        <>
        <Routes>
            <Route path="/" element={
                <PrivateRoute>
                    //home page component will be here
                </PrivateRoute>
                } />
        </Routes>
        </>
    )
}

export default MainRouter;