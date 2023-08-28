import React, {createContext } from 'react';
import axios from "axios"
import { useEffect, useState } from "react"


export const JobContext = createContext(null)
const JobProvider = ({children}) => {
    const [jobs, setJobs] = useState([])
    const [prevJobs, setPrevJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        axios.get('http://localhost:8570/delivery')
            .then(res => {
                setIsLoading(true)
                setJobs(res.data)
                console.log(res.data)
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8570/delivered')
            .then(res => {
                setIsLoading(true)
                setPrevJobs(res.data)
                setIsLoading(false)
            })
    }, [jobs])
 
        const jobInfo = {
            jobs,
            setJobs,
            prevJobs,
            setPrevJobs,
            isLoading
        }
    return (
        <JobContext.Provider value ={jobInfo}>
            {children}
        </JobContext.Provider>
    );
};

export default JobProvider;