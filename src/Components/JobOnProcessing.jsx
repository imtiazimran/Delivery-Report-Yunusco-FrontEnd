

import { useContext, useState } from "react";
import { JobContext } from "./Context/JobProvider";
import axios from "axios";
import Swal from "sweetalert2";
import PD_Modal from "./ui/Modal";

const JobOnProcessing = () => {

    const { jobs,
        isLoading,
        handleDelete,
        handleDeliveredJob,
        isOpen,
        setIsOpen,
        selectedJobForPartialDelivery,
        setSelectedJobForPartialDelivery,
        partialDeliveryQty,
        setPartialDeliveryQty
    } = useContext(JobContext)

    const handlePartialDeliveryModal = (job) => {
        setSelectedJobForPartialDelivery(job);
        setPartialDeliveryQty(0); // Reset input field
        setIsOpen(true)
    };

    const onProccess = jobs.filter((item) => !item.hasOwnProperty("deliveryType"))

    // console.log(currentJobs)

    const currentDeliveryQty = onProccess.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)






    return (
        <div>

            <PD_Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedJobForPartialDelivery={selectedJobForPartialDelivery}
                setSelectedJobForPartialDelivery={setSelectedJobForPartialDelivery}
                partialDeliveryQty={partialDeliveryQty}
                setPartialDeliveryQty={setPartialDeliveryQty}
            />

            <div className="rounded-xl text-2xl py-3 bg-sky-700 text-white text-center"><span className="loading loading-ring loading-xs"></span> Jobs On Processing <span className="loading loading-ring loading-xs"></span></div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr className="text-center">
                            <th>#</th>
                            <th>Customar</th>
                            <th>Job</th>
                            <th>Quantity</th>
                            <th>Label Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <span className="loading loading-bars loading-lg"></span>
                                </td>
                            </tr>
                        ) : onProccess.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No jobs Is in Process <br />
                                    Please add some jobs first.
                                </td>
                            </tr>
                        ) : (
                            onProccess.map((job, i) => (
                                <tr key={job._id} className="hover text-center">
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty.toLocaleString('en-IN')}</td>
                                    <td className='uppercase'>{job.label}</td>
                                    <td>
                                        <button onClick={() => handleDeliveredJob(job)} className="btn-md btn-success btn-outline rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>

                                        </button>
                                        <button onClick={() => handlePartialDeliveryModal(job)} className="btn-md btn-primary btn-outline rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                                            </svg>

                                        </button>
                                        <button onClick={() => handleDelete(job)} className="btn-md btn-error btn-outline rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        {
                            onProccess.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">

                                    </td>
                                </tr>
                            ) : <tr className='text-center'>
                                <th>#</th>
                                <th></th>
                                <th className='text-md text-yellow-600'>Total Quantity</th>
                                <th className='text-md text-yellow-600'>{currentDeliveryQty.toLocaleString('en-IN')} Piece</th>
                                <th></th>
                            </tr>
                        }

                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default JobOnProcessing;