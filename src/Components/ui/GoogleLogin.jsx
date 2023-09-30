
import { useContext } from 'react';// Replace with your actual auth context
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { JobContext } from '../Context/JobProvider';
import { AuthContext } from '../Context/AuthProvider';
import Lottie from 'lottie-react';
import google from "../../assets/google.json"

const GoogleLoginButton = () => {
    const { continueWithgoogle } = useContext(AuthContext);
    const { addUser } = useContext(JobContext)
    const navigate = useNavigate()

    // Callback function called on successful login
    const handleSuccess = async () => {
        continueWithgoogle()
            .then(res => {
                const loggeduser = res.user;
                const user = { name: loggeduser.displayName, email: loggeduser.email, image: loggeduser.imgURL }
                Swal.fire({
                    icon: 'success',
                    title: 'Login Success',
                    showConfirmButton: false,
                    timer: 1000,
                });
                addUser({ ...user, role: "user" })
                navigate("/")
            })
            .catch(err => console.log(err))
    };

    // Callback function called on failed login


    return (
        <div className='flex items-center justify-center py-3'>
            <button
                onClick={handleSuccess}
                className="btn btn-outline btn-success rounded flex items-center gap-2"
            >
                <Lottie className='w-10' animationData={google} />  <p>Sign in with Google</p>
            </button>
        </div>
    );
};

export default GoogleLoginButton;
