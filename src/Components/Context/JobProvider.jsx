import React, {createContext } from 'react';
import axios from "axios"
import { useEffect, useState } from "react"


export const JobContext = createContext(null)
const JobProvider = ({children}) => {
    const [jobs, setJobs] = useState([])
    const [prevJobs, setPrevJobs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    
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