import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Context/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import loginImg from "/login.svg"
import GoogleLoginButton from './GoogleLogin';
import Lottie from 'lottie-react';
import Loader from "../../assets/loader2.json"

const Login = () => {
    const { signIn, loading } = useContext(AuthContext)
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        if (data.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        signIn(data.email, data.password)
            .then(res => {
                const loggedUser = res.user;
                Swal.fire({
                    icon: 'success',
                    title: `Welcome ${loggedUser.email}`,
                    showConfirmButton: "OK",
                    timer: 1500,
                });
            })
            .then(res => {
                navigate('/')
            })
    }
    return (
        <div className='min-h-screen bg-base-200'>

            <h1 className="text-5xl font-bold py-5 text-center">Login !</h1>
            {
                loading ? <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
                : <div className="hero">
                    <div className="hero-content justify-around flex-col lg:flex-row w-full">
                        <div className="text-center lg:text-left w-2/5 hidden lg:block">
                            <img className='w-full' src={loginImg} alt="" />
                        </div>
                        <div className="card  flex-shrink-0 lg:w-2/4 max-w-sm shadow-2xl bg-base-100">
                            <GoogleLoginButton />
                            <div className="divider">OR</div>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="card-body">
                                    <div className="flex flex-col mb-5 form-control">
                                        <label htmlFor="title" className="mb-2">
                                            Email
                                        </label>
                                        <input
                                            required
                                            className="w-full rounded-md"
                                            type="text"
                                            id="title"
                                            placeholder="example@gmail.com"
                                            {...register("email", { required: true })}
                                        />
                                        {errors.email && <span className="text-red-600 pt-1">This field is required</span>}
                                    </div>
                                    <div className="flex flex-col mb-5 form-control">
                                        <label htmlFor="title" className="mb-2">
                                            Password
                                        </label>
                                        <input
                                            required
                                            className="w-full rounded-md"
                                            type="password"
                                            id="title"
                                            {...register("password", { required: true })}
                                        />
                                    </div>
    
                                    <div className="form-control mt-6">
                                        <button className="btn btn-primary">Login</button>
                                    </div>
                                </div>
                            </form>
                            <Link className='p-2' to="/registration">Don't Have Account? <span className='text-blue-500'>Register!</span></Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Login;