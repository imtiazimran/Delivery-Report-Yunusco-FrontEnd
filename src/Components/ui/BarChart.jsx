import React, { useContext, useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { JobContext } from '../Context/JobProvider';

const deliveryData = [
  { day: 1, qty: 100 },
  { day: 2, qty: 150 },
  { day: 3, qty: 200 },
  { day: 4, qty: 200 },
  { day: 5, qty: 200 },
  { day: 6, qty: 200 },
  { day: 7, qty: 200 },
  { day: 8, qty: 200 },
  { day: 9, qty: 200 },
  { day: 10, qty: 200 },
  { day: 11, qty: 200 },
  { day: 12, qty: 200 },
  { day: 13, qty: 200 },
  { day: 14, qty: 200 },
  { day: 15, qty: 200 },
  { day: 16, qty: 200 },
  { day: 17, qty: 2000 },
  { day: 18, qty: 200 },
  { day: 19, qty: 200 },
  { day: 20, qty: 200 },
  { day: 21, qty: 200 },
  { day: 22, qty: 200 },
  { day: 23, qty: 200 },
];

const DeliveryReportChart = () => {
  const { prevJobs } = useContext(JobContext)
  const [chartWidth, setChartWidth] = useState(600); // Initial width
  const [chartHeight, setChartHeight] = useState(300); // Initial height
  const chartContainerRef = useRef('');

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

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentMonthJobs = prevJobs.filter((job) => {
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


  // Assuming currentMonthJobs is an array of objects with a goodsDeliveryDate property
  const chartData = currentMonthJobs.reduce((accumulator, job) => {
    const date = job.goodsDeliveryDate.substring(0, 2); // Extracting the first 2 characters of the date

    // Check if the date already exists in the accumulator array
    const existingDateIndex = accumulator.findIndex(item => item.date === date);

    // If the date doesn't exist, add it to the accumulator
    if (existingDateIndex === -1) {
      accumulator.push({
        day: accumulator.length + 1, // Incremental day number
        qty: job.qty,
        date: date,
      });
    } else {
      // If the date already exists, update the qty (assuming you want to sum the quantities)
      accumulator[existingDateIndex].qty += job.qty;
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
    <h1 className='md:text-xl text-center font-semibold py-5 bg-slate-600'>Delivery Chart of {currentDate.toLocaleString('default', { month: 'long' })}</h1>
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
