
import React from 'react';
import Stat from './Stat';
import JobOnProcessing from './JobOnProcessing';
import PreviousDelivery from './PreviousDelivery';

const Home = () => {
    return (
        <div className='w-4/5 mx-auto'>
            <Stat/>
            <JobOnProcessing/>
            <PreviousDelivery/>
            
        </div>
    );
};

export default Home;