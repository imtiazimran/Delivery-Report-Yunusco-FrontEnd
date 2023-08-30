

import { useContext } from "react";
import { JobContext } from "./Context/JobProvider";
import axios from "axios";
import Swal from "sweetalert2";

const JobOnProcessing = () => {

    const { jobs, isLoading, setJobs } = useContext(JobContext)

    const currentDeliveryQty = jobs.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)


    const handleDeliveredJob = async (job) => {
        console.log(job._id)
        try {
            await axios.put(`https://delivery-report-yunusco-back-end.vercel.app/markDelivered/${job._id}`);
            setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));

            // Display SweetAlert success alert
            Swal.fire({
                icon: 'success',
                title: 'Job Marked as Delivered',
                text: `${job.po} is successfully marked as delivered.`,
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Job Already Exists',
                    text: 'Job with this PO already exists.',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            console.error("Error delivering job:", error);
            // Handle error and show a message to the user
        }
    };

    const handleDelete = async (job) => {
        // Show a confirmation dialog using Swal.fire
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://delivery-report-yunusco-back-end.vercel.app/deleteJob/${job._id}`);
                    setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));
    
                    // Display SweetAlert success alert
                    Swal.fire({
                        icon: 'success',
                        title: 'Job Deleted',
                        text: 'The job has been successfully Deleted from On Proccessing delivery.',
                    });
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        Swal.fire({
                            position: 'top-center',
                            icon: 'error',
                            title: 'Job Already Exists',
                            text: 'Job with this PO already exists.',
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                    console.error("Error delivering job:", error);
                    // Handle error and show a message to the user
                }
            }
        });
    };
    



    return (
        <div>
            <div className="text-2xl py-3 bg-sky-700 text-white text-center"><span className="loading loading-ring loading-xs"></span> Jobs On Processing <span className="loading loading-ring loading-xs"></span></div>
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
                                <td colSpan="5" className="text-center">
                                    <span className="loading loading-bars loading-lg"></span>
                                </td>
                            </tr>
                        ) : (
                            jobs.map((job, i) => (
                                <tr key={job._id} className="hover text-center">
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty}</td>
                                    <td className='uppercase'>{job.label}</td>
                                    <td><button onClick={() => handleDeliveredJob(job)} className="btn-md btn-success btn-outline">Finish</button>
                                        <button onClick={() => handleDelete(job)} className="btn-md btn-error btn-outline">Delete</button></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr className='text-center'>
                            <th>#</th>
                            <th></th>
                            <th className='text-md text-yellow-600'>Total Quantity</th>
                            <th className='text-md text-yellow-600'>{currentDeliveryQty.toLocaleString('en-IN')} Piece</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default JobOnProcessing;