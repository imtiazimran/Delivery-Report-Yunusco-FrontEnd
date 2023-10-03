import React, { createContext } from 'react';
import axios from "axios"
import { useEffect, useState } from "react"
import Swal from 'sweetalert2';


export const JobContext = createContext(null)
const JobProvider = ({ children }) => {

    const [isAdmin, setIsAdmin] = useState(false)
    const [jobs, setJobs] = useState([])
    const [users, setUsers] = useState([])
    const [prevJobs, setPrevJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [selectedJobForPartialDelivery, setSelectedJobForPartialDelivery] = useState(null);
    const [partialDeliveryQty, setPartialDeliveryQty] = useState(0);

    const baseUrl = "https://delivery-report-yunusco-back-end.vercel.app"
    // const baseUrl = "http://localhost:8570"

    useEffect(() => {
        axios.get(`${baseUrl}/delivery`)
            .then(res => {
                setIsLoading(true)
                setJobs(res.data)
                setIsLoading(false)
            })
    }, [jobs])

    useEffect(() => {
        axios.get(`${baseUrl}/delivered`)
            .then(res => {
                setIsLoading(true)
                setPrevJobs(res.data)
                setIsLoading(false)
            })
    }, [prevJobs])
    // get all the users
    useEffect(() => {
        axios.get(`${baseUrl}/users`)
            .then(res => {
                setIsLoading(true)
                setUsers(res.data)
                setIsLoading(false)
            })
    }, [users])

    // get logged user only
    const handleAdminSearch = (email) => {
        axios.get(`${baseUrl}/isAdmin/${email}`)
            .then(res => {
                setIsLoading(true)
                
                if(res.data.role === "admin"){
                    setIsAdmin(true)
                }
                setIsLoading(false)
            })
    }
    const addUser = async (user) => {
        try {
            await axios.post(`${baseUrl}/postUser`, user);
            // setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));

            // Display SweetAlert success alert
            // Swal.fire({
            //     icon: 'success',
            //     title: `User Added`,
            //     text: `User Successfully added to the database`,
            // });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                return
            }
            console.error("Error Adding user:", error);
            // Handle error and show a message to the user
        }
    };
    const handleDeliveredJob = async (job) => {
        try {
            await axios.put(`${baseUrl}/markDelivered/${job._id}`);
            setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));

            // Display SweetAlert success alert
            Swal.fire({
                icon: 'success',
                title: `JBH000${job.po} Marked as Delivered`,
                text: `Job successfully marked as delivered.`,
            });
        } catch (error) {
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Job Already Exists',
                    text: 'Job with this PO already exists.',
                    showConfirmButton: "OK"
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
                if(isAdmin){

                    try {
                        await axios.delete(`${baseUrl}/deleteJob/${job._id}`);
                        setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));
    
                        // Display SweetAlert success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'Job Deleted',
                            text: 'The job has been successfully Deleted from On Proccessing delivery.',
                        });
                    } catch (error) {
                        if (error) {
                            Swal.fire({
                                position: 'top-center',
                                icon: 'error',
                                title: `${error.message}`,
                                text: 'An Error Occured during this Oparation',
                                showConfirmButton: "OK"
                            });
                        }
                        console.error("Error delivering job:", error);
                        // Handle error and show a message to the user
                    }
                } else{
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: "Unauthorize Oparetion",
                        text: "Look Like You Don't have the permission to Delete Job",
                        showConfirmButton: "OK"
                    });
                }
            }
        });
    };
    const handleDeleteDeliveredJob = async (job) => {
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
                if(isAdmin){

                    try {
                        await axios.delete(`${baseUrl}/deleteDeliveredJob/${job._id}`);
                        setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));
    
                        // Display SweetAlert success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'Job Deleted',
                            text: 'The job has been successfully Deleted from Total delivery.',
                        });
                    } catch (error) {
                        if (error) {
                            Swal.fire({
                                position: 'top-center',
                                icon: 'error',
                                title: `404
                                NOT FOUND`,
                                text: `${error.message}`,
                                showConfirmButton: "OK"
                            });
                        }
                        console.error("Error delivering job:", error);
                        // Handle error and show a message to the user
                    }
                }else{
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: "Unauthorize Oparetion",
                        text: "Look Like You Don't have the permission to Delete Job",
                        showConfirmButton: "OK"
                    });
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
        handleDeleteDeliveredJob,
        isOpen,
        setIsOpen,
        selectedJobForPartialDelivery,
        setSelectedJobForPartialDelivery,
        partialDeliveryQty,
        setPartialDeliveryQty,
        addUser,
        handleAdminSearch,
        isLoading
    }
    return (
        <JobContext.Provider value={jobInfo}>
            {children}
        </JobContext.Provider>
    );
};

export default JobProvider;