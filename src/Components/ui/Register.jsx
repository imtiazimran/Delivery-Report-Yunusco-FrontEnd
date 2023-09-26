import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Context/AuthProvider';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JobContext } from '../Context/JobProvider';

const Register = () => {
    const { signUp } = useContext(AuthContext)
    const { addUser } = useContext(JobContext)
    const navigate = useNavigate()

    const { register, handleSubmit, formState: { errors }, watch } = useForm();

    const validatePasswordMatch = (value) => {
        const password = watch('password'); // Get the value of the 'password' field
        return value === password || 'Passwords do not match';
    };

    const onSubmit = data => {
        if (data.password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        signUp(data.email, data.password)
            .then(res => {
                const loggedUser = res.user;
                const user = { name: loggedUser.name, email: loggedUser.email }
                Swal.fire({
                    icon: 'success',
                    title: `Welcome ${loggedUser.name}`,
                    showConfirmButton: "OK",
                    timer: 1500,
                });
                addUser({...user, status : "user"})
            })
            .then(res => {
                navigate('/')
            })
    }
    return (
        <div className='min-h-screen bg-base-200'>

            <h1 className="text-5xl font-bold py-5 text-center">Register !</h1>
            <div className="hero">
                <div className="hero-content justify-around flex-col lg:flex-row-reverse w-full">
                    <div className="text-center lg:text-left w-2/5 hidden lg:block">
                        <img className='w-full' src="https://cdni.iconscout.com/illustration/premium/thumb/online-registration-4489363-3723270.png" alt="" />
                    </div>
                    <div className="card  flex-shrink-0 lg:w-2/4 max-w-sm shadow-2xl bg-base-100">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="card-body">
                                <div className="flex flex-col mb-5 form-control">
                                    <label htmlFor="title" className="mb-2">
                                        Name
                                    </label>
                                    <input
                                        required
                                        className="w-full rounded-md"
                                        type="text"
                                        id="title"
                                        {...register("name", { required: true })}
                                        placeholder="John Doe"
                                    />
                                    {errors.name && <span className="text-red-600 pt-1">This field is required</span>}
                                </div>
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
                                <div className="flex flex-col mb-5 form-control">
                                    <label htmlFor="confirmPass" className="mb-2">
                                        Confirm Password
                                    </label>
                                    <input
                                        required
                                        className={`w-full rounded-md ${errors.confirmPass ? 'border-red-500' : ''
                                            }`}
                                        type="password"
                                        id="confirmPass"
                                        {...register('confirmPass', {
                                            required: 'This field is required',
                                            validate: validatePasswordMatch, // Use the custom validation rule
                                        })}
                                    />
                                    {errors.confirmPass && (
                                        <span className="text-red-600 pt-1">{errors.confirmPass.message}</span>
                                    )}
                                </div>

                                <div className="form-control mt-6">
                                    <button className="btn btn-primary">Sign Up</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;