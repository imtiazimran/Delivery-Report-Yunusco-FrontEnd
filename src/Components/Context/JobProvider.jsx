import React, { createContext } from 'react';
import axios from "axios"
import { useEffect, useState } from "react"
import Swal from 'sweetalert2';


export const JobContext = createContext(null)
const JobProvider = ({ children }) => {
    const [jobs, setJobs] = useState([])
    const [prevJobs, setPrevJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    const [isOpen, setIsOpen] = useState(false)
    const [selectedJobForPartialDelivery, setSelectedJobForPartialDelivery] = useState(null);
    const [partialDeliveryQty, setPartialDeliveryQty] = useState(0);

    useEffect(() => {
        axios.get('https://delivery-report-yunusco-back-end.vercel.app/delivery')
            .then(res => {
                setIsLoading(true)
                setJobs(res.data)
                setIsLoading(false)
            })
    }, [prevJobs])

    useEffect(() => {
        axios.get('https://delivery-report-yunusco-back-end.vercel.app/delivered')
            .then(res => {
                setIsLoading(true)
                setPrevJobs(res.data)
                setIsLoading(false)
            })
    }, [jobs])


    const handleDeliveredJob = async (job) => {
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


    const jobInfo = {
        jobs,
        setJobs,
        prevJobs,
        setPrevJobs,
        handleDeliveredJob,
        handleDelete,
        isOpen,
        setIsOpen,
        selectedJobForPartialDelivery,
        setSelectedJobForPartialDelivery,
        partialDeliveryQty,
        setPartialDeliveryQty,
        isLoading
    }
    return (
        <JobContext.Provider value={jobInfo}>
            {children}
        </JobContext.Provider>
    );
};

export default JobProvider;