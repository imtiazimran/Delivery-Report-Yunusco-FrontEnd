import React, { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useGetAllJobsQuery } from '../Redux/api/totalJobApi';

const DeliveryReportChart = () => {
  const [chartWidth, setChartWidth] = useState(600);
  const [chartHeight, setChartHeight] = useState(300);
  const chartContainerRef = useRef('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [view, setView] = useState('monthly'); // 'monthly' or 'daily'
  const { data: deliveredData } = useGetAllJobsQuery();
  const { data: jobs } = deliveredData || {};

  // Function to parse delivery date string
  const parseDeliveryDate = (dateString) => {
    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Process monthly data
  useEffect(() => {
    if (!jobs) return;

    const monthData = Array(12).fill(0).map((_, index) => ({
      month: index,
      monthName: new Date(2000, index, 1).toLocaleString('default', { month: 'long' }),
      qty: 0
    }));

    jobs.forEach(job => {
      try {
        const deliveryDate = parseDeliveryDate(job.goodsDeliveryDate);
        if (deliveryDate.getFullYear() === selectedYear) {
          const month = deliveryDate.getMonth();
          const qty = parseInt(job.qty) || 0;
          monthData[month].qty += qty;
        }
      } catch (error) {
        console.error('Error processing job:', error);
      }
    });

    setMonthlyData(monthData);
  }, [jobs, selectedYear]);

  // Process daily data when a month is selected
  useEffect(() => {
    if (!jobs || selectedMonth === null) return;

    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const dailyData = Array(daysInMonth).fill(0).map((_, index) => ({
      day: index + 1,
      date: `${String(index + 1).padStart(2, '0')}/${String(selectedMonth + 1).padStart(2, '0')}`,
      qty: 0
    }));

    jobs.forEach(job => {
      try {
        const deliveryDate = parseDeliveryDate(job.goodsDeliveryDate);
        if (deliveryDate.getFullYear() === selectedYear && 
            deliveryDate.getMonth() === selectedMonth) {
          const day = deliveryDate.getDate() - 1;
          const qty = parseInt(job.qty) || 0;
          dailyData[day].qty += qty;
        }
      } catch (error) {
        console.error('Error processing job:', error);
      }
    });

    setDailyData(dailyData);
  }, [jobs, selectedYear, selectedMonth]);

  // Handle chart resize
  useEffect(() => {
    const handleResize = () => {
      if (chartContainerRef.current) {
        const containerWidth = chartContainerRef.current.offsetWidth;
        setChartWidth(containerWidth);
        setChartHeight(500);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle bar click
  const handleBarClick = (data) => {
    if (view === 'monthly') {
      setSelectedMonth(data.month);
      setView('daily');
    }
  };

  // Handle back button click
  const handleBackToMonths = () => {
    setSelectedMonth(null);
    setView('monthly');
  };

  const totalDelivery = monthlyData.reduce((sum, month) => sum + month.qty, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-purple-600 px-4 py-2 rounded text-white">
          <p className="font-semibold">{`${label}`}</p>
          <p>{`Quantity: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const printPDF = () => {
    setTimeout(() => {
      if (chartContainerRef.current) {
        const content = chartContainerRef.current.innerHTML;
        const originalDocument = document.body.innerHTML;
        document.body.innerHTML = content;
        window.print();
        document.body.innerHTML = originalDocument;
      }
    }, 1000);
  };

  return (
    <div ref={chartContainerRef} className="w-full max-w-screen-full mx-auto bg-slate-800">
      <div className="flex justify-between items-center bg-slate-600 p-5">
        <button 
          className="rounded pdf px-3 hover:text-blue-400" 
          onClick={printPDF}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <h1 className='md:text-xl text-center font-semibold'>
          {view === 'monthly' 
            ? `Monthly Delivery Chart ${selectedYear}`
            : `Daily Delivery Chart - ${monthlyData[selectedMonth]?.monthName} ${selectedYear}`
          }
        </h1>
        <div className="flex gap-2">
          {view === 'daily' ? (
            <button
              onClick={handleBackToMonths}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Months
            </button>
          ) : (
            <>
              <button
                onClick={() => setSelectedYear(prev => prev - 1)}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                ←
              </button>
              <button
                onClick={() => setSelectedYear(prev => prev + 1)}
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={selectedYear >= new Date().getFullYear()}
              >
                →
              </button>
            </>
          )}
        </div>
      </div>

      <h2 className='py-5 text-center text-xl text-white'>
        Total Delivery: {
          view === 'monthly' 
            ? monthlyData.reduce((sum, month) => sum + month.qty, 0).toLocaleString()
            : dailyData.reduce((sum, day) => sum + day.qty, 0).toLocaleString()
        }
      </h2>

      <BarChart
        width={chartWidth}
        height={chartHeight}
        data={view === 'monthly' ? monthlyData : dailyData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey={view === 'monthly' ? "monthName" : "date"}
          angle={-45}
          textAnchor="end"
          height={60}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar 
          dataKey="qty" 
          fill="#8884d8"
          name="Delivery Quantity"
          onClick={view === 'monthly' ? handleBarClick : undefined}
          cursor={view === 'monthly' ? 'pointer' : 'default'}
        />
      </BarChart>
    </div>
  );
};

export default DeliveryReportChart;

