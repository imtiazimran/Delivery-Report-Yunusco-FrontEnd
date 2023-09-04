import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';
import PD_Modal from './ui/Modal';

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
        <div>
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
                        ) : partialDeliveries.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">
                                    No Partial Jobs
                                </td>
                            </tr>
                        ) : (
                            partialDeliveries.map((job, i) => (
                                <tr key={job._id} className="hover text-center">
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty.toLocaleString('en-IN')}</td>
                                    <td className='uppercase'>{job.label}</td>
                                    <td>
                                        <button onClick={() => handleDeliveredJob(job)} className="btn-md btn-success btn-outline">Finish</button>
                                        <button onClick={() => handlePartialDeliveryModal(job)} className="btn-md btn-primary btn-outline">PD</button>
                                        <button onClick={() => handleDelete(job)} className="btn-md btn-error btn-outline">Delete</button></td>
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
                            ) : <tr className='text-center'>
                                <th>#</th>
                                <th></th>
                                <th className='text-md text-yellow-600'>Total Quantity</th>
                                <th className='text-md text-yellow-600'>{partialQty.toLocaleString('en-IN')} Piece</th>
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