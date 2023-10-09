import React, { useContext, useEffect, useRef, useState } from 'react';
import { JobContext } from './Context/JobProvider';
import Loader from "../assets/loader2.json"
import Lottie from 'lottie-react';

import AOS from 'aos';
// AOS.init();

const TotalDelivery = () => {
    const {
        prevJobs,
        isLoading,
        handleDeleteDeliveredJob,
        selectedJobForUpdateData,
        setSelectedJobForUpdateData,
        updatedQuantity,
        setUpdatedQuantity,
        updatedDeliveryDate,
        setUpdatedDeliveryDate,
        handleUpdateDateQty,
    } = useContext(JobContext);

    useEffect(() => {
        AOS.init();
    }, []);



    const [searchQuery, setSearchQuery] = useState("")
    const editDateDialogRef = useRef(null);

    const handleChangeDate = (job) => {
        document.getElementById('editDate').showModal()
        setSelectedJobForUpdateData(job)
        setUpdatedDeliveryDate(job.goodsDeliveryDate)
        setUpdatedQuantity(job.qty)
    }

    const handleQuantityChange = (e) => {
        setUpdatedQuantity(e.target.value);
    }

    const handleDeliveryDateChange = (e) => {
        setUpdatedDeliveryDate(e.target.value);
    }

    const handleCloseModal = () => {
        if (editDateDialogRef.current) {
            editDateDialogRef.current.close();
        }
    };

    const handleEditJob = async (e) => {
        e.preventDefault()
        handleUpdateDateQty()
        handleCloseModal()
    }

    // console.log(selectedJobForUpdateData)

    const filteredJobs = prevJobs.filter((job) =>
        job.po.toLowerCase().includes(searchQuery.toLowerCase()) || job.customar.toLowerCase().includes(searchQuery.toLocaleLowerCase())
    );
    // Calculate total previous delivery quantity
    const totalPrevDelivery = filteredJobs.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    return (
        <div>
            <div className="text-2xl py-3 bg-sky-700 text-white text-center">Total Delivery  </div>
            <div className="form-control">
                <div className="input-group input-group-sm justify-center my-5">
                    <input onChange={(e) => setSearchQuery(e.target.value)} type="text" placeholder="Search…" className="input input-sm input-bordered" />
                    <button className="btn btn-sm btn-square">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </div>
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
                            <th>Delivery Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
                                </td>
                            </tr>
                        ) : (
                            filteredJobs.map((job, i) => (
                                <tr
                                    data-aos="zoom-in-left"
                                    data-aos-easing="linear"
                                    data-aos-duration="400"
                                    onDoubleClick={() => handleDeleteDeliveredJob(job)}
                                    key={job._id}
                                    className="hover text-center"
                                >

                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job.customar}</td>
                                    <td>JBH00{job.po}</td>
                                    <td>{job.qty.toLocaleString('en-IN')}</td>
                                    <td className='uppercase'>{job.label}</td>
                                    <td> <span className='flex justify-center gap-3 items-center flex-col lg:flex-row'>
                                        <button className='text-primary' onClick={() => handleChangeDate(job)}>

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                        {job?.goodsDeliveryDate}

                                    </span></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot>
                        <tr className='text-center bg-yellow-600'>
                            <th>#</th>
                            <th></th>
                            <th className='text-xl text-white'>Total Quantity</th>
                            <th className='text-xl text-white'>{totalPrevDelivery.toLocaleString('en-IN')} Pcs</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>

                {/* Open the modal using document.getElementById('ID').showModal() method */}
                <dialog
                    id="editDate"
                    className="modal"
                    ref={editDateDialogRef}
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">JBH000{selectedJobForUpdateData?.po}</h3>
                        <button onClick={handleCloseModal} className="btn btn-sm btn-outline absolute right-2 top-2">Close</button>
                        <form method="dialog" onSubmit={handleEditJob} className="mx-auto w-4/5">
                            <label className=" block my-5">
                                <span className="block">Quantity</span>
                                <input name="qty" value={updatedQuantity} onChange={handleQuantityChange} type="text" className="input input-bordered input-sm w-full max-w-xs" />
                            </label>
                            <label className="block">
                                <span className="block">Delivery Date</span>
                                <input name='date' value={updatedDeliveryDate} onChange={handleDeliveryDateChange} type="text" className="input input-bordered input-sm w-full max-w-xs" />
                            </label>
                            <button type='submit' className="btn btn-outline btn-info btn-sm my-5">Submit</button>
                        </form>
                    </div>
                </dialog>


            </div>
        </div>
    );
};


export default TotalDelivery;
