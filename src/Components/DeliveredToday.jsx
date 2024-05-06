import React, { useContext, useRef } from 'react';
import { JobContext } from './Context/JobProvider';
import { Link } from 'react-router-dom';
import { usePDF } from "react-to-pdf"
import EmptyAmimation from "../assets/blank.json"
import Loader from "../assets/loader2.json"
import Lottie from "lottie-react";
import { useGetAllJobsQuery } from './Redux/api/totalJobApi';

const DeliveredToday = () => {
    const {
        //  prevJobs,
        // isLoading,
        handleDeleteDeliveredJob,
        selectedJobForUpdateData,
        setSelectedJobForUpdateData,
        updatedQuantity,
        setUpdatedQuantity,
        updatedDeliveryDate,
        setUpdatedDeliveryDate,
        handleUpdateDateQty
    } = useContext(JobContext);
    const editDateDialogRef = useRef(null);
    // console.log(prevJobs)
    const currentDate = new Date();

    const {data: deliveredData, isLoading} = useGetAllJobsQuery()
    const {data: prevJobs} = deliveredData || {}


    // Calculate start of today's date (midnight)
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    // Filter deliveries for today's date
    const todaysDeliveries = prevJobs?.filter(currentJob => {
        if (currentJob.goodsDeliveryDate.toLocaleString()) {
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, startOfToday);
        }
        return false;
    });
    const totalDeliveryToday = todaysDeliveries?.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);


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

    const { toPDF, targetRef } = usePDF({ filename: 'Delivered Today.pdf' });

    const printPDF = () => {
        setTimeout(() => {
            if (targetRef.current) {
                const content = targetRef.current.innerHTML;
                const originalDocument = document.body.innerHTML;
                document.body.innerHTML = content;
                window.print();
                document.body.innerHTML = originalDocument;
            } else {
                console.error("Error: Unable to find targetRef.");
            }
        }, 1000); // Adjust the delay as needed
    };

    // console.log(todaysDeliveries);

    return (
        <div className='pb-16'>
            {todaysDeliveries?.length === 0 || (
                <div className="text-2xl bg-cyan-900 text-white py-4 text-center"> {todaysDeliveries?.length} Jobs Delivered Today
                    <button className="rounded pdf px-3 hover:text-blue-400" onClick={() => printPDF()}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            )}

            <div className="overflow-x-auto relative" ref={targetRef}>
                {isLoading ? (
                    <div className="text-center">
                        <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
                    </div>
                ) : todaysDeliveries.length === 0 ? (
                    <div className="text-center ">
                        <span className="lg:text-2xl text-xl bg-cyan-900 text-white py-4 text-center block font-semibold capitalize lg:w-1/4 mx-auto lg:absolute top-1/4 z-50">No Job delivered today <br /> <Link to={"previousDelivery"} >View Previous Delivery</Link>   </span>
                        <Lottie className="lg:w-1/4 mx-auto" animationData={EmptyAmimation} />
                    </div>
                ) : (
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr className="text-center text-white bg-yellow-600 text-xl">
                                <th>#</th>
                                <th>Customer</th>
                                <th>Job</th>
                                <th>Quantity</th>
                                <th>Label Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todaysDeliveries?.map((job, i) => (
                                
                                <tr onDoubleClick={() => handleDeleteDeliveredJob(job)} key={job._id} className="text-center">
                                
                                    <th>{i + 1}</th>
                                    <td className='capitalize'>{job?.customer}</td>
                                    <td>JBH00{job.po}</td>
                                    <td className='flex justify-center items-center gap-1'>
                                        <span>{job.qty.toLocaleString('en-IN')}</span>
                                        <button className='text-primary' onClick={() => handleChangeDate(job)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </button>
                                    </td>
                                    <td className='uppercase'>{job.label}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className='text-center bg-yellow-600 rounded'>
                                <th>#</th>
                                <th></th>
                                <th className='text-xl text-white'>Total Quantity</th>
                                <th className='text-xl text-white'>{totalDeliveryToday?.toLocaleString()} Pcs</th>
                                <th></th>
                            </tr>
                        </tfoot>
                    </table>
                )}
                <dialog
                    id="editDate"
                    className="modal"
                    ref={editDateDialogRef}
                >
                    <div className="modal-box">
                        <h3 className="font-bold text-lg text-center">JBH000{selectedJobForUpdateData?.po}</h3>
                        <button onClick={handleCloseModal} className="btn btn-sm btn-outline absolute right-2 top-2">Close</button>
                        <form method="dialog" onSubmit={handleEditJob} className="mx-auto w-4/5 text-black">
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


function parseCustomDate(dateString) {
    let delimiter = '-';
    if (dateString.includes('/')) {
        delimiter = '/';
    }

    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split(delimiter);
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

export default DeliveredToday;