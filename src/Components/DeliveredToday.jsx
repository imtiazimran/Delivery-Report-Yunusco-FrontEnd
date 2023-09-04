import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';
import { Link } from 'react-router-dom';

const DeliveredToday = () => {
    const { prevJobs, isLoading } = useContext(JobContext);
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
    const totalPrevDelivery = todaysDeliveries.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);
    return (
        <div>
            <div className="text-2xl rounded-xl py-3 bg-green-700 text-white text-center"> {todaysDeliveries.length} Jobs Delivered Today  </div>
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
                        ) : todaysDeliveries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className='text-center'>
                                    <p>
                                        No Job Delivered Today <br /> <br /> <Link className='btn-link' to={"/previousDelivery"}>View Previous Delivery</Link>
                                    </p>
                                </td>
                            </tr>
                        ) 
                        : (
                            todaysDeliveries.map((job, i) => (
                                <tr key={job._id} className="hover text-center ">
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