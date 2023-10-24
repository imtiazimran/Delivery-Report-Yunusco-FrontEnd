import axios from 'axios';
import React, { useState } from 'react';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from './Context/AuthProvider';
import Lottie from 'lottie-react';
import Loader from "../assets/loader2.json"
import { JobContext } from './Context/JobProvider';

const AddJobs = ({ isOpen, setIsOpen }) => {

    const { AddJobs, isLoading } = useContext(JobContext)

    const { user } = useContext(AuthContext)

    // console.log(user.displayName);

    const handleSubmit = e => {
        setIsloading(true)
        e.preventDefault()
        const form = e.target;
        const customar = form.customar.value
        const po = form.po.value
        const qty = form.qty.value
        const label = form.label.value

        const addJobs = {
            customar,
            po,
            qty: parseInt(qty),
            label,
            addedBy: user?.displayName ? user?.displayName : user?.email
        }
        if (user) {
            AddJobs(addJobs)
            setIsOpen(false)
        } else {
            setIsloading(false)
            setIsOpen(false)
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: "No User Found",
                text: "Please log In to add jobs",
                confirmButtonText: "Login",
                showConfirmButton: true,
                showCancelButton: true
            })
                .then(() => {
                    window.location = "/login"
                })
        }
    }




    const handleCloseModal = () => {
        setIsOpen(false)
    };

    if (isOpen) {
        document.getElementById('addJob').showModal();
    } else {
        document.getElementById('addJob')?.close();
    }

    return (

        <div>
            <dialog
                id="addJob"
                className="modal"
            >
                {
                    isLoading ?
                        <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
                        :
                        <div className="modal-box">

                            <button onClick={handleCloseModal} className="btn btn-sm btn-outline absolute right-2 top-2">Close</button>
                            <form onSubmit={handleSubmit} className='lg:w-3/4 mx-auto py-10 w-3/4'>

                                <div className="flex flex-col mb-5">
                                    <label htmlFor="title" className="mb-2">
                                        Customar
                                    </label>
                                    <input
                                        required
                                        className="w-full rounded-md"
                                        type="text"
                                        id="title"
                                        name='customar'
                                        placeholder="Exp: Apex Textile"
                                    />
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="title" className="mb-2">
                                        Job No
                                    </label>
                                    <input
                                        required
                                        className="w-full rounded-md"
                                        type="number"
                                        id="title"
                                        name='po'
                                        placeholder="Exp: 342050"
                                    />
                                </div>

                                <div className="flex flex-col mb-5">
                                    <label htmlFor="title" className="mb-2">
                                        Quantity
                                    </label>
                                    <input
                                        required
                                        className="w-full rounded-md"
                                        type="number"
                                        id="title"
                                        name='qty'
                                        placeholder="Quantity"
                                    />
                                </div>
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="title" className="mb-2">
                                        Label Name
                                    </label>
                                    <input
                                        required
                                        className="w-full rounded-md uppercase"
                                        type="text"
                                        id="title"
                                        name='label'
                                        placeholder="Exp: HM14149"
                                    />
                                </div>

                                <button disabled={isLoading} type="submit" className='btn btn-outline btn-info btn-sm'> {
                                    isLoading ? <span className="loading loading-infinity loading-md"></span> : <span>Submit</span>
                                }</button>
                            </form>
                        </div>
                }
            </dialog>
        </div>
    );
};

export default AddJobs;