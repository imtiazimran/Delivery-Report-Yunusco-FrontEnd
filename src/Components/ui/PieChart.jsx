import React, { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useGetAllJobsQuery } from '../Redux/api/totalJobApi';

const DeliveryPieChart = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [customerData, setCustomerData] = useState([]);
  const { data: deliveredData } = useGetAllJobsQuery();
  const { data: jobs } = deliveredData || {};

  // Colors for different customers
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  // Parse delivery date
  const parseDeliveryDate = (dateString) => {
    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Process data by customer
  useEffect(() => {
    if (!jobs) return;

    // Filter jobs for selected month and year
    const filteredJobs = jobs.filter(job => {
      const deliveryDate = parseDeliveryDate(job.goodsDeliveryDate);
      return (
        deliveryDate.getMonth() === selectedMonth &&
        deliveryDate.getFullYear() === selectedYear
      );
    });

    // Group by customer and sum quantities
    const customerSums = filteredJobs.reduce((acc, job) => {
      const customer = job.customar;
      if (!acc[customer]) {
        acc[customer] = 0;
      }
      acc[customer] += parseInt(job.qty) || 0;
      return acc;
    }, {});

    // Convert to array format for PieChart
    const data = Object.entries(customerSums).map(([name, value]) => ({
      name,
      value
    }));

    // Sort by quantity (descending)
    data.sort((a, b) => b.value - a.value);
    setCustomerData(data);
  }, [jobs, selectedMonth, selectedYear]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 rounded-lg border border-slate-600">
          <p className="text-white font-semibold">{payload[0].name}</p>
          <p className="text-white">
            Quantity: {payload[0].value.toLocaleString()}
          </p>
          <p className="text-white">
            Share: {((payload[0].value / totalQuantity) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const totalQuantity = customerData.reduce((sum, item) => sum + item.value, 0);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Add this custom label renderer function at the top level of your component
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
    const RADIAN = Math.PI / 180;
    // Increase this value to push labels further from the pie
    const radius = outerRadius * 1.2;
    
    // Calculate label position
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is greater than 3%
    if (percent < 0.03) return null;

    return (
      <text 
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
      >
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
  };

  // Add a new ref for the chart container
  const chartContainerRef = useRef(null);
  const [chartDimensions, setChartDimensions] = useState({ width: 1000, height: 600 });

  // Add this useEffect to handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.offsetWidth;
        const isMobile = window.innerWidth < 640;
        setChartDimensions({
          width: width,
          height: isMobile ? width * 0.8 : Math.min(width * 0.6, 600)
        });
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className="w-full bg-slate-800 py-5 px-2 sm:py-4 ">
      <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-600 p-3 sm:p-5 rounded-t-lg gap-3 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-semibold text-white text-center sm:text-left">
          Customer Distribution - {monthNames[selectedMonth]} {selectedYear}
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-1 rounded bg-slate-700 text-white w-full sm:w-auto"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setSelectedYear(prev => prev - 1)}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              ←
            </button>
            <span className="px-4 py-1 bg-slate-700 text-white rounded">
              {selectedYear}
            </span>
            <button
              onClick={() => setSelectedYear(prev => prev + 1)}
              className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={selectedYear >= new Date().getFullYear()}
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center mt-4">
        <h2 className="text-lg sm:text-xl text-white mb-4">
          Total Quantity: {totalQuantity.toLocaleString()}
        </h2>
        
        <div className="w-full" ref={chartContainerRef}>
          <PieChart 
            width={chartDimensions.width} 
            height={chartDimensions.height}
          >
            <Pie
            className='piechart'
              data={customerData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={Math.min(chartDimensions.width, chartDimensions.height) * (window.innerWidth < 640 ? 0.25 : 0.3)}
              fill="#8884d8"
              dataKey="value"
              label={window.innerWidth < 640 ? null : renderCustomizedLabel}
            >
              {customerData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              layout={window.innerWidth < 640 ? "horizontal" : "vertical"}
              align={window.innerWidth < 640 ? "center" : "right"}
              verticalAlign={window.innerWidth < 640 ? "bottom" : "middle"}
              wrapperStyle={{
                paddingLeft: window.innerWidth < 640 ? "0" : "20px",
                fontSize: window.innerWidth < 640 ? "12px" : "14px"
              }}
            />
          </PieChart>
        </div>
        <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
          {customerData.map((customer, index) => (
            <div 
              key={customer.name}
              className="bg-slate-700 p-3 sm:p-4 rounded-lg text-white text-sm sm:text-base"
              style={{ borderLeft: `4px solid ${COLORS[index % COLORS.length]}` }}
            >
              <h3 className="font-semibold">{customer.name}</h3>
              <p>Quantity: {customer.value.toLocaleString()}</p>
              <p>Share: {((customer.value / totalQuantity) * 100).toFixed(1)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryPieChart;