
import React, { useContext, useEffect } from 'react';
import Stat from './Stat';
import JobOnProcessing from './JobOnProcessing';
import DeliveredToday from './DeliveredToday';
import DeliveryReportChart from './ui/BarChart';
import { JobContext } from './Context/JobProvider';
import PreviousDelivery from './PreviousDelivery';
import { useGetProcessingJobsQuery } from './Redux/api/addJobApi';
import { useGetAllJobsQuery } from './Redux/api/totalJobApi';

const Home = () => {

    const {data: deliveredData} = useGetAllJobsQuery()
    const {data: prevJobs} = deliveredData || {}

    const {data, refetch} = useGetProcessingJobsQuery()
    const onProccess = data?.filter((item) => !item.hasOwnProperty("deliveryType"))
    const currentDate = new Date();
    // Calculate start of today's date (midnight)
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0

    // Filter deliveries for today's date
    const todaysDeliveries = prevJobs?.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) {
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

    useEffect(() => {
        refetch()
    },[])

    return (
        <div className='backgruond-color mt-16'>
            <Stat />
            <DeliveryReportChart />
            {onProccess?.length !== 0 && <JobOnProcessing/> }
            
            {
                totalDeliveryToday === 0 ? <PreviousDelivery /> : <DeliveredToday />
            }

        </div>
    );
};
function parseCustomDate(dateString) {
    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
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
export default Home;