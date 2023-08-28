import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div>
            <div className="navbar ">
                <div className="flex-none lg:hidden">
                    <div className="drawer-content">
                        {/* Page content here */}
                        <label htmlFor="my-drawer" className=" drawer-button"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg></label>
                    </div>
                </div>
                <div className="flex-1 justify-between">
                    <Link to={"/"} className=" text-orange-500 normal-case text-xl">Yunusco T&A (BD) LTD. </Link>
                    <div className='hidden lg:block'>
                        <Link className='mx-3 bg-blue-500 text-white p-1 rounded' to={"/addJobs"}>Add Job</Link>
                        <Link className='mx-3 bg-blue-500 text-white p-1 rounded' to={"/previousDelivery"}>Previous Job</Link>
                        <Link className='mx-3 bg-blue-500 text-white p-1 rounded' to={"/totalDelivery"}>Total Delivery</Link>
                    </div>
                </div>
            </div>

            <div className="drawer">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-side">
                    <label htmlFor="my-drawer" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-80 h-full bg-base-200 text-base-content">
                        {/* Sidebar content here */}
                        <Link className='my-3 bg-blue-500 text-white p-1 rounded' to={"/addJobs"}>Add Job</Link>
                        <Link className='my-3 bg-blue-500 text-white p-1 rounded' to={"/previousDelivery"}>Previous Job</Link>
                        <Link className='my-3 bg-blue-500 text-white p-1 rounded' to={"/totalDelivery"}>Total Delivery</Link>
                        
                    </ul>
                </div>
            </div>

        </div>
    );
};

export default Navbar;