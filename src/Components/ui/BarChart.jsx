import React, { useContext, useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { JobContext } from '../Context/JobProvider';


const DeliveryReportChart = () => {
  const { prevJobs } = useContext(JobContext)
  const [chartWidth, setChartWidth] = useState(600); // Initial width
  const [chartHeight, setChartHeight] = useState(300); // Initial height
  const chartContainerRef = useRef('');
  const [reduceMonth, setReduceMonth] = useState(-1)
  const [currentMonthJobs, setCurrentMonthJobs] = useState([])
  const [currentMonth, setCurrentMonth] = useState('')


  const preMonth = () => {
    setReduceMonth(reduceMonth - 1)
  }

  const nextMonth = () => {
    // Disable the forward button when date is equal to yesterdayDate
    setReduceMonth(reduceMonth + 1);
  }

  // Adjust chart dimensions based on container size
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        // Set the chart width relative to the container width
        setChartWidth(containerWidth);
        // Set the chart height as needed
        // You can adjust this based on your layout requirements
        setChartHeight(500);
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Call the resize handler once to set initial dimensions
    handleResize();

    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentDate = new Date();
  const updatedCurrentMonth = currentDate.getMonth() + reduceMonth;

  useEffect(() => {
    setCurrentMonth(updatedCurrentMonth)
    const currentYear = currentDate.getFullYear();
    const filteredJobs = prevJobs.filter((job) => {
      const dateParts = job.goodsDeliveryDate.split('-');
      if (dateParts.length === 3) {
        const deliveryDate = new Date(
          parseInt(dateParts[2], 10), // Year
          parseInt(dateParts[1], 10) - 1, // Month (0-indexed)
          parseInt(dateParts[0], 10) // Day
        );
        return (
          deliveryDate.getMonth() === updatedCurrentMonth &&
          deliveryDate.getFullYear() === currentYear
        );
      }
      return false;
    });
    setCurrentMonthJobs(filteredJobs);
  }, [prevJobs, reduceMonth]);



  // const currentDate = new Date();

  // const currentMonth = currentDate.getMonth();
  // const currentYear = currentDate.getFullYear();
  // const currentMonthJobs = prevJobs.filter((job) => {
  //   const dateParts = job.goodsDeliveryDate.split('-');
  //   if (dateParts.length === 3) {
  //     const deliveryDate = new Date(
  //       parseInt(dateParts[2], 10), // Year
  //       parseInt(dateParts[1], 10) - 1, // Month (0-indexed)
  //       parseInt(dateParts[0], 10) // Day
  //     );
  //     return (
  //       deliveryDate.getMonth() === currentMonth &&
  //       deliveryDate.getFullYear() === currentYear
  //     );
  //   }
  //   return false;
  // });

  // console.log(currentMonth);

  // const increaseMonth = (currentMonth) => {
  //   // Increase the current month by 1, handling the case where the current month is December (index 11)
  //   return currentMonth === 11 ? 0 : currentMonth + 1;
  // };

  // const decreaseMonth = (currentMonth) => {
  //   // Decrease the current month by 1, handling the case where the current month is January (index 0)
  //   console.log(currentMonth);
  //   return currentMonth === 0 ? 11 : currentMonth - 1;
  // };

  const currentMonthTotalDelivery = currentMonthJobs.reduce((accumulator, currentJob) => {
    const qtyAsNumber = parseInt(currentJob.qty); // Convert the string to an integer
    if (!isNaN(qtyAsNumber)) {
      return accumulator + qtyAsNumber;
    }
    return accumulator; // If conversion fails, return the accumulator unchanged
  }, 0);


  const sortedJobs = currentMonthJobs.sort((a, b) => {
    // Convert delivery dates to Date objects for comparison
    const dateA = new Date(a.goodsDeliveryDate);
    const dateB = new Date(b.goodsDeliveryDate);
    return dateA - dateB;
  });

  const chartData = sortedJobs.reduce((accumulator, job) => {
    const date = job.goodsDeliveryDate.substring(0, 2); // Extracting the first 2 characters of the date
    // Check if the date already exists in the accumulator array
    const existingDateIndex = accumulator.findIndex(item => item.date === date);
    // If the date doesn't exist, add it to the accumulator
    if (existingDateIndex === -1) {
      accumulator.push({
        day: parseInt(date, 10), // Use the actual date instead of incrementing
        qty: parseInt(job.qty),
        date: date,
      });
    } else {
      // If the date already exists, update the qty (assuming you want to sum the quantities)
      accumulator[existingDateIndex].qty += parseInt(job.qty);
    }

    return accumulator;
  }, []);



  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-purple-600 px-2 py-1">
          <p>{`Day: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={`tooltip-${index}`} >
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };


  return (
    <div ref={chartContainerRef} className="w-full max-w-screen-full mx-auto bg-slate-800">
      <h1 className='md:text-xl text-center font-semibold py-5 bg-slate-600'>
        Delivery Chart of {updatedCurrentMonth === 0 ? "January" :
          updatedCurrentMonth === 1 ? "February" :
            updatedCurrentMonth === 2 ? "March" :
              updatedCurrentMonth === 3 ? "April" :
                updatedCurrentMonth === 4 ? "May" :
                  updatedCurrentMonth === 5 ? "June" :
                    updatedCurrentMonth === 6 ? "July" :
                      updatedCurrentMonth === 7 ? "August" :
                        updatedCurrentMonth === 8 ? "September" :
                          updatedCurrentMonth === 9 ? "October" :
                            updatedCurrentMonth === 10 ? "November" :
                              "December"}
      </h1>

      <div className='flex justify-center text-xl gap-4'><button onClick={() => preMonth()}>previous month</button>  <button onClick={() => nextMonth()}>next month</button></div>

      <h2 className='py-5 text-center text-xl'>Total Delivery: {currentMonthTotalDelivery.toLocaleString()}</h2>
      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={chartData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis dataKey="qty" />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="qty" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default DeliveryReportChart;
