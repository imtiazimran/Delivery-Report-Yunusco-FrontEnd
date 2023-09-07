import React, { useContext, useState } from 'react';
import { JobContext } from './Context/JobProvider';

const TotalDelivery = () => {
    const { prevJobs, isLoading } = useContext(JobContext);

    const [searchQuery, setSearchQuery] = useState("")

    const filteredJobs = prevJobs.filter((job) =>
        job.po.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate total previous delivery quantity
    const totalPrevDelivery = prevJobs.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    return (
        <div>
            <div className="text-2xl py-3 bg-sky-700 text-white text-center">Total Delivery  </div>
            <input onChange={(e) => setSearchQuery(e.target.value)}
                type="number"
                placeholder="Search By JOB"
                className="input input-bordered input-primary w-4/5 mx-auto block my-5 max-w-xs text-center" />
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
                            <th>Delivery Date</th>
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
                            filteredJobs.map((job, i) => (
                                <tr key={job._id} className="hover text-center ">
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty.toLocaleString('en-IN')}</td>
                                    <td className='uppercase'>{job.label}</td>
                                    <td>{job.goodsDeliveryDate}</td>
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


export default TotalDelivery;
