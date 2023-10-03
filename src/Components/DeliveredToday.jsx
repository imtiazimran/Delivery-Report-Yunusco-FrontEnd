import React, { useContext, useRef, useState } from 'react';
import { JobContext } from './Context/JobProvider';
import { Link } from 'react-router-dom';
import { usePDF } from "react-to-pdf"
import EmptyAmimation from "../assets/blank.json"
import Loader from "../assets/loader2.json"
import Lottie from "lottie-react";

const DeliveredToday = () => {
    const { prevJobs, isLoading, handleDeleteDeliveredJob } = useContext(JobContext);
    // console.log(prevJobs)
    const currentDate = new Date();


    // Calculate start of today's date (midnight)
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    // Filter deliveries for today's date
    const todaysDeliveries = prevJobs.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) {
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, startOfToday);
        }
        return false;
    });
    const totalDeliveryToday = todaysDeliveries.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);


    const { toPDF, targetRef } = usePDF({ filename: 'Delivered Today.pdf' });

    return (
        <div>
            {
                todaysDeliveries.length === 0 || <div className="text-2xl rounded-xl py-3 bg-green-700 text-white text-center"> {todaysDeliveries.length} Jobs Delivered Today
                    <button className="rounded pdf px-3 hover:text-blue-400" onClick={() => toPDF()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                    </button>
                </div>
            }

            <div className="overflow-x-auto" ref={targetRef}>
                <table className="table">
                    {/* head */}
                    {
                        todaysDeliveries.length === 0 || <thead>
                            <tr className="text-center">
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
                                    <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
                                </td>
                            </tr>
                        ) : todaysDeliveries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className='text-center'>
                                    <span className="lg:text-2xl text-center block font-semibold capitalize lg:w-1/4 mx-auto lg:absolute top-2/4 z-50">No Job delivered today <br /> <Link to={"previousDelivery"} >View Previous Delivery</Link>   </span>
                                    <Lottie className="lg:w-1/4 mx-auto" animationData={EmptyAmimation} />
                                </td>
                            </tr>
                        )
                            : (
                                todaysDeliveries.map((job, i) => (
                                    <tr onDoubleClick={() => handleDeleteDeliveredJob(job)} key={job._id} className="hover text-center ">
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
                        todaysDeliveries.length === 0 || <tfoot>
                            <tr className='text-center bg-yellow-600 rounded'>
                                <th>#</th>
                                <th></th>
                                <th className='text-xl text-white'>Total Quantity</th>
                                <th className='text-xl text-white'>{totalDeliveryToday.toLocaleString('en-IN')} Pcs</th>
                                <th></th>
                            </tr>
                        </tfoot>
                    }

                </table>
            </div>
        </div>
    );
};


function parseCustomDate(dateString) {
    const [datePart, timePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    const [hours, minutes, seconds] = timePart.split(':');
    return new Date(year, month - 1, day, hours, minutes, seconds);
}

// Helper function to check if two dates are the same
function isSameDate(date1, date2) {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
}

export default DeliveredToday;