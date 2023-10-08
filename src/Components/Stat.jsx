import React, { useContext } from 'react';
import { JobContext } from './Context/JobProvider';
import { Link } from 'react-router-dom';

const Stat = () => {
    const { jobs, prevJobs } = useContext(JobContext)

    // --------------------Current Delivery Calculation--------------------------

    const currentJobs = jobs.filter((item) => !item.hasOwnProperty("deliveryType"))
    const balanceJobs = jobs.filter((item) => item.hasOwnProperty("deliveryType"))

    const currentDeliveryQty = currentJobs.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)
    const balanceQty = balanceJobs.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)

    // ------------------Previous Delivery--------------------------------
    const currentDate = new Date();

    // Calculate yesterday's date
    const yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);


    // Filter deliveries for yesterday's date
    const yesterdayDeliveries = prevJobs.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) { // Check if goodsDeliveryDate is not empty
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, yesterdayDate);
        }
        return false; // Skip jobs without a valid delivery date
    });

    // Calculate total previous delivery quantity
    const totalPrevDelivery = yesterdayDeliveries.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    // ------------------------------------ Total Delivery Calculation----------------------------------

    const totalDelivery = prevJobs.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);


    // ------------------------------------ today Delivery Calculation----------------------------------
    const startOfToday = new Date(currentDate);
    startOfToday.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
    const todaysDeliveries = prevJobs.filter(currentJob => {
        if (currentJob.goodsDeliveryDate) {
            const deliveryDate = parseCustomDate(currentJob.goodsDeliveryDate);
            return isSameDate(deliveryDate, startOfToday);
        }
        return false;
    });
    const DeliveredToday = todaysDeliveries.reduce((accumulator, currentJob) => {
        const qtyAsNumber = parseInt(currentJob.qty, 10); // Convert the string to an integer
        if (!isNaN(qtyAsNumber)) {
            return accumulator + qtyAsNumber;
        }
        return accumulator; // If conversion fails, return the accumulator unchanged
    }, 0);

    // console.log(totalDeliveryToday);

    return (
        <div className='p-5 flex justify-center '>
            <div className="stats stats-vertical lg:stats-horizontal shadow ">
                {
                    todaysDeliveries != 0 &&
                        <div className="stat text-center">
                            <div className="stat-title">Delivered Today</div>
                            <div className="stat-desc">{todaysDeliveries.length} Jobs</div>
                            <div className="stat-value">{DeliveredToday.toLocaleString('en-IN')}</div>
                            <div className="stat-desc">{startOfToday.toLocaleDateString()}</div>
                        </div>
                }
                {
                    yesterdayDeliveries != 0 &&
                    <Link to={"/previousDelivery"}>
                        <div className="stat text-center">
                            <div className="stat-title">Previous Delivery</div>
                            <div className="stat-desc">{yesterdayDeliveries.length} Jobs</div>
                            <div className="stat-value">{totalPrevDelivery.toLocaleString('en-IN')}</div>
                            <div className="stat-desc">{yesterdayDate.toLocaleDateString()}</div>
                        </div>
                    </Link>
                }

                {
                    currentDeliveryQty != 0 &&
                    <div className="stat text-center">
                        <div className="stat-title">On Going</div>
                        <div className="stat-value">{currentDeliveryQty.toLocaleString("en-IN")}</div>
                        <div className="stat-desc">↗︎ </div>
                    </div>
                }

                <Link to={"/totalDelivery"}>
                    <div className="stat text-center">
                        <div className="stat-title">Total Delivery</div>
                        <div className="stat-value">{totalDelivery.toLocaleString("en-IN")}</div>
                    </div>
                </Link>
                {
                    balanceQty != 0 && <Link to={"/partialDelivery"}>
                        <div className="stat text-center">
                            <div className="stat-title">Balance Quantity</div>
                            <div className='stat-value'>{balanceQty.toLocaleString("en-IN")}</div>
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