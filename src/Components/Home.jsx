
import React from 'react';
import Stat from './Stat';
import JobOnProcessing from './JobOnProcessing';
import PreviousDelivery from './PreviousDelivery';
import DeliveredToday from './DeliveredToday';

const Home = () => {
    return (
        <div className='w-4/5 mx-auto mt-16'>
            <Stat/>
            <JobOnProcessing/>
            <br />
            <br />
            <br />
            <DeliveredToday/>
            <br />
            <br />
            <br />
            <br />
            <br />
            
        </div>
    );
};

export default Home;