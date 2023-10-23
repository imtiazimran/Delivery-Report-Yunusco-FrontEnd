import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';
import PD_Modal from './ui/Modal';

import NothingFound from "../assets/nothingFound.json"
import Loader from "../assets/loader2.json"
import Lottie from "lottie-react";
const PartialJobs = () => {
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



    const partialDeliveries = jobs.filter((item) => item.hasOwnProperty("deliveryType"))
    // console.log(handleDeliveredJob)

    const partialQty = partialDeliveries.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)
    return (
        <div className='mt-16 py-8 backgruond-color'>
            <PD_Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedJobForPartialDelivery={selectedJobForPartialDelivery}
                setSelectedJobForPartialDelivery={setSelectedJobForPartialDelivery}
                partialDeliveryQty={partialDeliveryQty}
                setPartialDeliveryQty={setPartialDeliveryQty}
            />
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    {
                        partialDeliveries.length === 0 || <thead>
                            <tr className="text-center">
                                <th>#</th>
                                <th>Customar</th>
                                <th>Job</th>
                                <th>Quantity</th>
                                <th>Label Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    }
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
                                </td>
                            </tr>
                        ) : partialDeliveries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    <span className="lg:text-2xl text-center block font-semibold capitalize bg-opacity-5 lg:w-1/4 mx-auto lg:absolute top-2/4 z-50">No Partial Jobs</span>
                                    <Lottie className="lg:w-1/4 mx-auto" animationData={NothingFound} />
                                </td>
                            </tr>
                        ) : (
                            partialDeliveries.map((job, i) => (
                                <tr onDoubleClick={() => handleDelete(job)} key={job._id} className="hover text-center">
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty.toLocaleString('en-IN')}</td>
                                    <td className='uppercase'>{job.label}</td>
                                    <td>
                                        <button onClick={() => handleDeliveredJob(job)} className="btn-md btn-success btn-outline">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                        <button onClick={() => handlePartialDeliveryModal(job)} className="btn-md btn-primary btn-outline">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                                            </svg>
                                        </button>

                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        {
                            partialDeliveries.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">

                                    </td>
                                </tr>
                            ) : <tr className='text-center bg-yellow-600'>
                                <th>#</th>
                                <th></th>
                                <th className='text-xl text-white'>Total Quantity</th>
                                <th className='text-xl text-white'>{partialQty.toLocaleString('en-IN')} Piece</th>
                                <th></th>
                                <th></th>
                            </tr>
                        }

                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default PartialJobs;