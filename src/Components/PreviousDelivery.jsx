import React, { useContext, useState } from 'react';
import { JobContext } from './Context/JobProvider';

const PreviousDelivery = () => {
    const { prevJobs, isLoading, handleDeleteDeliveredJob } = useContext(JobContext);
    const [reduceADay, setReduceADay] = useState(1)
    const currentDate = new Date();



    // Calculate yesterday's date
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - reduceADay);

    const preDalivery = () => {
        console.log("function hitting:", reduceADay);
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

    return (
        <div>
            <div className="text-2xl rounded-xl py-3 bg-violet-700 text-white text-center flex justify-center items-center gap-3">
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
            </div>
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
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <span className="loading loading-bars loading-lg"></span>
                                </td>
                            </tr>
                        ) : (
                            yesterdayDeliveries.map((job, i) => (
                                <tr onDoubleClick={() => handleDeleteDeliveredJob(job)} key={job._id} className="hover text-center">
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty.toLocaleString('en-IN')}</td>
                                    <td className='uppercase'>{job.label}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr className='text-center bg-yellow-500'>
                            <th>#</th>
                            <th></th>
                            <th className='text-xl text-white'>Total Quantity</th>
                            <th className='text-xl text-white '>{totalPrevDelivery.toLocaleString('en-IN')} Pcs</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

// Helper function to parse a date in the format "DD-MM-YYYY HH:MM:SS"
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

export default PreviousDelivery;
