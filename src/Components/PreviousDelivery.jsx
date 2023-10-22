import React, { useContext, useState } from 'react';
import { JobContext } from './Context/JobProvider';
import EmptyBox from "../assets/EmptyBox.json"
import Loader from "../assets/loader2.json"
import Lottie from "lottie-react";
import { usePDF } from 'react-to-pdf';
const PreviousDelivery = () => {
    const { prevJobs, isLoading, handleDeleteDeliveredJob } = useContext(JobContext);
    const [reduceADay, setReduceADay] = useState(1)
    const currentDate = new Date();



    // Calculate yesterday's date
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - reduceADay);

    const preDalivery = () => {
        setReduceADay(reduceADay + 1)
    }

    const forwardDelivery = () => {
        // Disable the forward button when date is equal to yesterdayDate
        if (isSameDate(currentDate, yesterdayDate)) {
            return;
        }
        setReduceADay(reduceADay - 1);
    }



    // Filter deliveries for yesterday's date
    const yesterdayDeliveries = prevJobs.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) { // Check if goodsDeliveryDate is not empty
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, yesterdayDate);
        }
        return false; // Skip jobs without a valid delivery date
    });

    // Calculate total previous delivery quantity
    const totalPrevDelivery = yesterdayDeliveries.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    
    const { toPDF, targetRef } = usePDF({ filename: `${yesterdayDate.toLocaleDateString()} Delivery.pdf` });

    return (
        <div className='mt-16 py-16 w-11/12 mx-auto backgruond-color'>
            <div className="text-2xl rounded-xl py-3 mb-16 bg-violet-700 text-white text-center flex justify-center items-center gap-3">
                <span onClick={preDalivery} className='cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </span>
                <span> Delivery Date {yesterdayDate.toLocaleDateString()}</span>
                <span onClick={forwardDelivery} className={`cursor-pointer ${isSameDate(currentDate, yesterdayDate) ? 'disabled' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </span>

                <button className="rounded pdf px-3 hover:text-blue-400" onClick={() => toPDF()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                </button>
            </div>
            <div className="overflow-x-auto" ref={targetRef}>
                <table className="table">
                    {/* head */}
                    {
                        yesterdayDeliveries.length === 0 || <thead>
                            <tr className="text-center bg-yellow-500 text-white lg:text-xl">
                                <th>#</th>
                                <th>Customar</th>
                                <th>Job</th>
                                <th>Quantity</th>
                                <th>Label Name</th>
                            </tr>
                        </thead>
                    }

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <Lottie className="w-1/4 mx-auto" animationData={Loader} />
                                </td>
                            </tr>
                        ) : yesterdayDeliveries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className='text-center'>
                                    <span className="lg:text-2xl text-center block font-semibold capitalize  lg:w-1/4 mx-auto z-50">No Job delivered on {yesterdayDate.toLocaleDateString()}</span>
                                    <Lottie className="w-3/4 lg:w-2/5 mx-auto" animationData={EmptyBox} />
                                </td>
                            </tr>
                        ) : (
                            yesterdayDeliveries.map((job, i) => (
                                <tr onDoubleClick={() => handleDeleteDeliveredJob(job)} key={job._id} className=" text-center">
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty.toLocaleString('en-IN')}</td>
                                    <td className='uppercase'>{job.label}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {
                        yesterdayDeliveries.length === 0 || <tfoot>
                            <tr className='text-center bg-yellow-500'>
                                <th>#</th>
                                <th></th>
                                <th className='text-xl text-white'>Total Quantity</th>
                                <th className='text-xl text-white '>{totalPrevDelivery.toLocaleString('en-IN')} Pcs</th>
                                <th></th>
                            </tr>
                        </tfoot>
                    }

                </table>
            </div>
        </div>
    );
};

// Helper function to parse a date in the format "DD-MM-YYYY HH:MM:SS"
function parseCustomDate(dateString) {
    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    return new Date(year, month - 1, day);
}

// Helper function to check if two dates are the same
function isSameDate(date1, date2) {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export default PreviousDelivery;
