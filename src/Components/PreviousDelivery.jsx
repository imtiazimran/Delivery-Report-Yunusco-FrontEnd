import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';

const PreviousDelivery = () => {
    const { prevJobs, isLoading } = useContext(JobContext);

    const currentDate = new Date();

    // Calculate yesterday's date
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);


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
            <div className="text-2xl py-3 bg-sky-700 text-white text-center">Previous Delivery {yesterdayDate.toLocaleDateString()} </div>
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
                            <tr key={job._id} className="hover text-center">
                                <th>{i + 1}</th>
                                <td className='capitalize'>{job.customar}</td>
                                <td>JBH00{job.po}</td>
                                <td>{job.qty}</td>
                                <td className='uppercase'>{job.label}</td>
                            </tr>
                        ))
                    )}
                </tbody>
                <tfoot>
                    <tr className='text-center'>
                        <th>#</th>
                        <th></th>
                        <th className='text-md text-yellow-600'>Total Quantity</th>
                        <th className='text-md text-yellow-600'>{totalPrevDelivery.toLocaleString('en-IN')} Piece</th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
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
