import React, { createContext, useRef } from 'react';
import axios from "axios"
import { useEffect, useState } from "react"
import Swal from 'sweetalert2';
import { baseUrl } from '../Redux/api/addJobApi';


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
    const [currentUser, setCurrentUser] = useState([])
    const [selectedJobForUpdateData, setSelectedJobForUpdateData] = useState(null)
    const [updatedQuantity, setUpdatedQuantity] = useState("");
    const [updatedDeliveryDate, setUpdatedDeliveryDate] = useState("");
    const [sample, setSample] = useState([])
    const editDateDialogRef = useRef(null);

  


    // get samples
    useEffect(() => {
        axios.get(`${baseUrl}/sample`)
            .then(res => {
                setIsLoading(true)
                setSample(res.data)
                setIsLoading(false)
            })
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))
    })

    useEffect(() => {
        if (!isLoading) {
            axios.get(`${baseUrl}/sample`)
                .then(res => {
                    setSample(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching sapmles:", error);
                });
        }
    }, [isLoading]);

    // get On Processing jobs
    // useEffect(() => {
    //     axios.get(`${baseUrl}/delivery`)
    //         .then(res => {
    //             setIsLoading(true)
    //             setJobs(res.data)
    //             setIsLoading(false)
    //         })
    // }, [])

    // get all delivered jobs
    // useEffect(() => {
    //     axios.get(`${baseUrl}/delivered?page=1&limit=100&searchTerm=''`)
    //         .then((res) => {
    //             setIsLoading(true);
    //             setPrevJobs(res.data);
    //         })
    //         .catch((error) => {
    //             console.error("Error fetching jobs:", error);
    //         })
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // }, []);


    // This effect runs when 'jobs' changes, but checks 'isLoading' to prevent endless calls
    // useEffect(() => {
    //     if (!isLoading) {
    //         axios.get(`${baseUrl}/delivery`)
    //             .then(res => {
    //                 setJobs(res.data);
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching jobs:", error);
    //             });
    //     }
    // }, [isLoading]);

    // This effect runs when 'prevJobs' changes, but checks 'isLoading' to prevent endless calls
    // useEffect(() => {
    //     if (!isLoading) {
    //         axios.get(`${baseUrl}/delivered`)
    //             .then((res) => {
    //                 setPrevJobs(res.data);
    //             })
    //             .catch((error) => {
    //                 console.error("Error fetching previous jobs:", error);
    //             });
    //     }
    // }, [isLoading]);


    // get all the users
    // useEffect(() => {
    //     axios.get(`${baseUrl}/users`)
    //         .then(res => {
    //             setIsLoading(true)
    //             setUsers(res.data)
    //             setIsLoading(false)
    //         })
    // }, [])

    // get logged user only
    const handleAdminSearch = (email) => {
        // Check if a request is already in progress

        axios.get(`${baseUrl}/currentUser/${email}`)
            .then(res => {
                setIsLoading(true);
                setCurrentUser(res.data);
                if (res.data.role === "Admin") {
                    setIsAdmin(true);
                }
            })
            .catch(error => {
                // Handle error here
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    const deleteUserFromDataBase = user => {

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
                if (currentUser.role === "Admin") {

                    try {
                        axios.delete(`${baseUrl}/user/${user._id}`)
                        setUsers(user => users.filter(u => u._id !== user._id));

                        // Display SweetAlert success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'User Deleted',
                            text: `${user.name} Deleted From Database.`,
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
                } else {
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


    }

    const makeEditor = async user => {
        try {
            await axios.patch(`${baseUrl}/user/editor/${user._id}`);

            // Display SweetAlert success alert
            Swal.fire({
                icon: 'success',
                title: `${user.name} `,
                text: `Is Editor From Now On.`,
            });
        } catch (error) {
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: 'Error While Uptading User Role',
                text: `${error.message}`,
                showConfirmButton: "OK"
            });

            console.error("Error delivering job:", error);
            // Handle error and show a message to the user
        }
    }
    const makeAdmin = async user => {
        try {
            await axios.patch(`${baseUrl}/user/admin/${user._id}`);

            // Display SweetAlert success alert
            Swal.fire({
                icon: 'success',
                title: `${user.name} `,
                text: `Is Admin From Now On.`,
            });
        } catch (error) {
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: 'Error While Uptading User Role',
                text: `${error.message}`,
                showConfirmButton: "OK"
            });

            console.error("Error delivering job:", error);
            // Handle error and show a message to the user
        }
    }

    // add user to the database while login
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

    // Add Sample 
    const AddSample = (sample) => {
        setIsLoading(true)
        axios.post(`${baseUrl}/addSample`, sample)
            .then(res => {
                setIsLoading(false)
                if (res.data.insertedId) {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: 'Sample Added',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                setIsLoading(false)
                console.log(error)
            });
    }
    // update Sample
    const updateSample = (sample) => {
        setIsLoading(true)
        axios.put(`${baseUrl}/updateSample/${sample._id}`, sample)
            .then(res => {
                setIsLoading(false)
                if (res.data.acknowledged) {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: 'Sample Updated',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            })
            .catch(error => {
                setIsLoading(false)
                console.log(error)
            });
    }

    
    // delete Sample
    const deleteSample = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this sample!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (currentUser?.role === "Admin" || currentUser?.role === "Editor") {
                    setIsLoading(true)
                    try {
                        await axios.delete(`${baseUrl}/deleteSample/${id}`);
                        window.location.reload()

                        // Display SweetAlert success alert
                        Swal.fire({
                            icon: 'success',
                            title: 'Job Deleted',
                            text: 'The Sample has been successfully Deleted',
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
                    finally {
                        setIsLoading(false)
                    }
                } else {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: "Unauthorize Oparetion",
                        text: "Look Like You Don't have the permission to Delete Samples",
                        showConfirmButton: "OK"
                    });
                }
            }
        });
    };



    // Add Job 

    const AddJobs = (job) => {
        setIsLoading(true)

        axios.post(`${baseUrl}/addJobs`, job)
            .then(res => {
                setIsLoading(false)
                if (res.data.insertedId) {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: 'Job Added',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    form.reset();
                }
            })
            .catch(error => {
                setIsLoading(false)
                console.log(error)
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
            });
    }
    const AddPartialJob = (job) => {
        setIsLoading(true)

        axios.post(`${baseUrl}/insertNewPartialDelivery`, job)
            .then(res => {
                setIsLoading(false)
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Job Added',
                    showConfirmButton: false,
                    timer: 1500
                });

            })
            .catch(error => {
                setIsLoading(false)
                console.log(error)
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
            });
    }



    // handle deliveredJob
    const handleDeliveredJob = async (job) => {
        setIsLoading(true)
        try {
            await axios.put(`${baseUrl}/markDelivered/${job._id}`);
            // Display SweetAlert success alert
            Swal.fire({
                icon: 'success',
                title: `JBH000${job.po} Marked as Delivered`,
                text: `Job successfully marked as delivered.`,
            });
            window.location.reload()
        } catch (error) {
            console.log(error); 
            if (error.response && error.response.status === 400) {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Job Already Exists',
                    text: `error.response.data.message`,
                    showConfirmButton: "OK"
                });
            }
            console.error("Error delivering job:", error);
            // Handle error and show a message to the user
        }
        finally {
            setIsLoading(false)
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
                if (currentUser?.role === "Admin" || currentUser?.role === "Editor") {
                    setIsLoading(true)
                    try {
                        await axios.delete(`${baseUrl}/deleteJob/${job._id}`);


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
                    finally {
                        setIsLoading(false)
                    }
                } else {
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
                if (currentUser?.role === "Admin" || currentUser?.role === "Editor") {
                    setIsLoading(true)
                    try {
                        await axios.delete(`${baseUrl}/deleteDeliveredJob/${job._id}`);
                        window.location.reload()
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
                    finally {
                        setIsLoading(false)
                    }
                } else {
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

    const handleUpdateDateQty = async () => {
        if (selectedJobForUpdateData && updatedQuantity > 0) {
            setIsLoading(true)
            try {
                const response = await axios.put(
                    `${baseUrl}/editedJob/${selectedJobForUpdateData._id}`,
                    { updatedQuantity, updatedDeliveryDate }
                );
                // Update the job in your state or context with the response data
                setSelectedJobForUpdateData(null);

                window.location.reload()
                if (editDateDialogRef.current) {
                    editDateDialogRef.current.close();
                }

                // Show SweetAlert success notification
                Swal.fire({
                    icon: 'success',
                    title: 'Date/Quantity Updated',
                    text: 'The Update Information has been done successfully .',
                    confirmButtonText: 'OK',
                });
            } catch (error) {
                console.log("Error updating  existing data:", error);
            }
            finally {
                setIsLoading(false)
            }
        }
    }



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
        AddPartialJob,
        setPartialDeliveryQty,
        addUser,
        handleAdminSearch,
        isLoading,
        setIsLoading,
        selectedJobForUpdateData,
        setSelectedJobForUpdateData,
        updatedQuantity,
        setUpdatedQuantity,
        updatedDeliveryDate,
        setUpdatedDeliveryDate,
        handleUpdateDateQty,
        editDateDialogRef,
        AddJobs,
        users,
        isAdmin,
        deleteUserFromDataBase,
        makeAdmin,
        makeEditor,
        sample,
        AddSample,
        updateSample,
        deleteSample,
    }
    return (
        <JobContext.Provider value={jobInfo}>
            {children}
        </JobContext.Provider>
    );
};

export default JobProvider;