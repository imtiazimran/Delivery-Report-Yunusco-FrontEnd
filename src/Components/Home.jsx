
import React from 'react';
import Stat from './Stat';
import JobOnProcessing from './JobOnProcessing';
import DeliveredToday from './DeliveredToday';

const Home = () => {
    return (
        <div className='backgruond-color mt-16'>
            <Stat />
            <JobOnProcessing />
            <DeliveredToday />
        </div>
    );
};

export default Home;