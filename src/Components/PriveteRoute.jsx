import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./Context/AuthProvider";
import Loader from "../assets/loader2.json"
import Lottie from "lottie-react";
const PrivetRoute = ({ children }) => {
    const {loading, user } = useContext(AuthContext);
        if (user) {
            // Redirect to the page
            return children;
        }

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
            <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
            </div>
        );
    }

    return <Navigate to="/login"></Navigate>;
};

export default PrivetRoute;
