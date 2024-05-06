import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';
import { Link } from 'react-router-dom';
import { useGetProcessingJobsQuery } from './Redux/api/addJobApi';
import { useGetAllJobsQuery } from './Redux/api/totalJobApi';

const Stat = () => {
    const { jobs } = useContext(JobContext)

    const {data: deliveredData} = useGetAllJobsQuery()
    const {data: prevJobs} = deliveredData || {}

    const {data:pendingJobs} = useGetProcessingJobsQuery()

    // --------------------Current Delivery Calculation--------------------------

    const currentJobs = jobs.filter((item) => !item.hasOwnProperty("deliveryType"))
    const balanceJobs = jobs.filter((item) => item.hasOwnProperty("deliveryType"))

    const currentDeliveryQty = currentJobs.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)
    const balanceQty = balanceJobs.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)

    // ------------------Previous Delivery--------------------------------
    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const currentMonthJobs = prevJobs?.filter((job) => {
        const dateParts = job.goodsDeliveryDate.split('-');
        if (dateParts.length === 3) {
            const deliveryDate = new Date(
                parseInt(dateParts[2], 10), // Year
                parseInt(dateParts[1], 10) - 1, // Month (0-indexed)
                parseInt(dateParts[0], 10) // Day
            );
            return (
                deliveryDate.getMonth() === currentMonth &&
                deliveryDate.getFullYear() === currentYear
            );
        }
        return false;
    });


    // Calculate yesterday's date
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);


    // Filter deliveries for yesterday's date
    const yesterdayDeliveries = prevJobs?.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) { // Check if goodsDeliveryDate is not empty
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, yesterdayDate);
        }
        return false; // Skip jobs without a valid delivery date
    });

    // Calculate total previous delivery quantity
    const totalPrevDelivery = yesterdayDeliveries?.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    // ------------------------------------ Total Delivery Calculation----------------------------------

    const currentMonthTotalDelivery = currentMonthJobs?.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);


    // ------------------------------------ today Delivery Calculation----------------------------------
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    const todaysDeliveries = prevJobs?.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) {
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, startOfToday);
        }
        return false;
    });
    const DeliveredToday = todaysDeliveries?.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    // console.log(pendingJobs);

    return (
        <div className='md:p-5 py-16 bg-gradient-to-r from-gray-600 to-gray-800 flex justify-center  '>
            <div className="stats stats-vertical md:stats-horizontal shadow w-10/12">
                {
                    todaysDeliveries != 0 &&
                    <div className="stat text-center">
                        <div className="stat-title">Delivered Today</div>
                        <div className="stat-desc">{todaysDeliveries?.length} Jobs</div>
                        <div className="stat-value text-3xl">{DeliveredToday}</div>
                        <div className="stat-desc">{startOfToday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                }
                {
                    yesterdayDeliveries != 0 &&
                    <Link to={"/previousDelivery"}>
                        <div className="stat text-center">
                            <div className="stat-title">Previous Delivery</div>
                            <div className="stat-desc">{yesterdayDeliveries?.length} Jobs</div>
                            <div className="stat-value md:text-3xl">{totalPrevDelivery}</div>
                            <div className="stat-desc">{yesterdayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                    </Link>
                }

                {
                    currentDeliveryQty != 0 &&
                    <div className="stat text-center">
                        <div className="stat-title">On Going</div>
                        <div className="stat-value">{currentDeliveryQty}</div>
                        <div className="stat-desc">↗︎ </div>
                    </div>
                }

                <Link to={"/totalDelivery"}>
                    <div className="stat text-center ">
                        <div className="stat-title">Total Delivery</div>
                        <div className="stat-desc">{currentMonthJobs?.length} Jobs</div>
                        <div className="stat-value text-3xl">{currentMonthTotalDelivery}</div>
                        <div className="stat-desc">From {new Date(new Date().getFullYear(), new Date().getMonth(), 1).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                </Link>
                {
                    balanceQty != 0 && <Link to={"/partialDelivery"}>
                        <div className="stat text-center">
                            <div className="stat-title">Balance Quantity</div>
                            <div className='stat-value'>{balanceQty}</div>
                        </div>
                    </Link>
                }

            </div>
        </div>
    );
};



// Helper function to parse a date in the format "DD-MM-YYYY HH:MM:SS"
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

export default Stat;