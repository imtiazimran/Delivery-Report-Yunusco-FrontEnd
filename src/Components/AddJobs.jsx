import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from './Context/AuthProvider';
import Lottie from 'lottie-react';
import Loader from "../assets/loader2.json"
import { JobContext } from './Context/JobProvider';
import { Switch } from '@headlessui/react';
import DatePicker from 'react-datepicker';
const AddJobs = ({ isOpen, setIsOpen }) => {
    const { AddJobs, AddPartialJob, isLoading, setIsLoading } = useContext(JobContext)
    const [enabled, setEnabled] = useState(true)
    const { user } = useContext(AuthContext)
    const currentDate = new Date();
    const datePickerRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(currentDate);

    const handleSubmit = e => {
        e.preventDefault()
        const form = e.target;
        const customar = form.customar.value
        const po = form.po.value
        const label = form.label.value
        let qty, totalQty, partialDeliveryQty;

        if (enabled) {
            qty = parseInt(form?.qty?.value);
        } else {
            totalQty = parseInt(form?.totalQty?.value);
            partialDeliveryQty = parseInt(form?.partialDeliveryQty?.value);
        }


        const formattedDate = `${('0' + selectedDate.getDate()).slice(-2)}-${('0' + (selectedDate.getMonth() + 1)).slice(-2)}-${selectedDate.getFullYear()}`;
        const addJobs = {
            customar,
            po,
            qty,
            totalQty,
            partialDeliveryQty,
            label,
            addedBy: user?.displayName ? user?.displayName : user?.email,
            goodsDeliveryDate: formattedDate
        };


        if (user) {
            if (enabled) {
                AddJobs(addJobs)
            } else {
                AddPartialJob(addJobs)
            }
            setIsOpen(false)
        } else {
            setIsOpen(false)
            setIsLoading(false)
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
    const handleDatePickerChange = (date) => {
        setSelectedDate(date);
    };

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
                            <div className='flex '>
                                <div>
                                    <span onClick={() => setEnabled(!enabled)} className='mx-3 cursor-pointer'>Partial</span>
                                    <Switch
                                        checked={enabled}
                                        onChange={setEnabled}
                                        className={`${enabled ? 'bg-blue-600' : 'bg-gray-800'
                                            } relative inline-flex w-10 items-center rounded-full`}
                                    >
                                        <span className="sr-only">Enable notifications</span>
                                        <span
                                            className={`${enabled ? 'translate-x-6' : ''
                                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                        />
                                    </Switch>
                                    <span onClick={() => setEnabled(!enabled)} className='mx-3 cursor-pointer'>Full</span>
                                </div>
                            </div>
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
                                {
                                    enabled ?
                                        <div className="flex flex-col mb-5">
                                            <label htmlFor="title" className="mb-2">
                                                <span>
                                                    Quantity
                                                </span>
                                            </label>
                                            <input
                                                required
                                                className="w-full rounded-md"
                                                type="number"
                                                id="title"
                                                name='qty'
                                                placeholder="Quantity"
                                            />
                                        </div> :
                                        <div className="flex gap-3 mb-5">
                                            <div>
                                                <label htmlFor="title" className="mb-2">
                                                    <span>
                                                        Total Quantity
                                                    </span>
                                                </label>
                                                <input
                                                    required
                                                    className="w-full rounded-md"
                                                    type="number"
                                                    id="title"
                                                    name='totalQty'
                                                    placeholder="Total Quantity"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="title" className="mb-2">
                                                    <span>
                                                        Partial Quantity
                                                    </span>
                                                </label>
                                                <input
                                                    required
                                                    className="w-full rounded-md"
                                                    type="number"
                                                    id="title"
                                                    name='partialDeliveryQty'
                                                    placeholder="Delivery Quantity"
                                                />
                                            </div>
                                        </div>
                                }

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
                                <div className="flex flex-col mb-5">
                                    <label htmlFor="title" className="mb-2">
                                        Delivery Date
                                    </label>
                                    <DatePicker
                                        className='w-full rounded-md uppercase'
                                        selected={selectedDate}
                                        onChange={handleDatePickerChange}
                                        dateFormat="dd/MM/yyyy"
                                        ref={datePickerRef}
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