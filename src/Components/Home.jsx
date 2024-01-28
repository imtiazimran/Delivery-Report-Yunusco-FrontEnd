
import React from 'react';
import Stat from './Stat';
import JobOnProcessing from './JobOnProcessing';
import DeliveredToday from './DeliveredToday';
import DeliveryReportChart from './ui/BarChart';

const Home = () => {
    return (
        <div className='backgruond-color mt-16'>
            <Stat />
            <DeliveryReportChart />
            <DeliveredToday />
        </div>
    );
};

export default Home;