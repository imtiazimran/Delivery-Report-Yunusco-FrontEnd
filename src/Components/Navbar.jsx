import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { JobContext } from './Context/JobProvider';
import AddJobs from './AddJobs';
import { AuthContext } from './Context/AuthProvider';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext)

    console.log("from navbar", user);

    const { jobs } = useContext(JobContext)

    const [isOpen, setIsOpen] = useState(false)

    const handleAddJobModal = () => {
        setIsOpen(true)
    }

    const handleLogOut = () => {
        logOut()
            .then(() => {
                Swal.fire({
                    icon: 'success',
                    title: "Log Out Success",
                    showConfirmButton: "OK",
                    timer: 3000,
                });
                window.location.reload();
            }).catch((error) => {
                console.log(error);
            });
    }

    // console.log(user);
    const partialDeliveries = jobs.filter((item) => item.hasOwnProperty("deliveryType"))
    return (
        <div>
            <AddJobs isOpen={isOpen} setIsOpen={setIsOpen} />
            <div className="navbar ">
                <div className="flex-1 justify-between">
                    <Link href='/' className=" text-orange-500 normal-case text-xl"> <img className='w-1/4' src="https://i.ibb.co/gwV6FjL/1553451971650-removebg-preview.png" alt="" /> </Link>
                    <div>
                        <div className="flex items-center gap-5">

                            <Menu as="div" className="relative inline-block text-left z-50 lg:hidden">
                                <div>
                                    <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                                        <ChevronDownIcon
                                            className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
                                            aria-hidden="true"
                                        />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >

                                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">

                                        <div className="px-1 py-1 ">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleAddJobModal}
                                                        className={`btn ${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                    >
                                                        {active ? (
                                                            <EditActiveIcon
                                                                className="mr-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <EditInactiveIcon
                                                                className="mr-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        Add Job
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={"/previousDelivery"}
                                                        className={`btn mt-2 ${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                    >
                                                        {active ? (
                                                            <DuplicateActiveIcon
                                                                className="mr-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <DuplicateInactiveIcon
                                                                className="mr-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        Previous Job
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                        </div>
                                        <div className="px-1 py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <Link
                                                        to={"/totalDelivery"}
                                                        className={` btn ${active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                    >
                                                        {active ? (
                                                            <ArchiveActiveIcon
                                                                className="mr-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        ) : (
                                                            <ArchiveInactiveIcon
                                                                className="mr-2 h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        )}
                                                        Total Delivery
                                                    </Link>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                <Link to="/partialDelivery">
                                                    <div className="indicator w-full text-sm py-2">
                                                        <span className="indicator-item badge badge-secondary ">{partialDeliveries.length}</span>
                                                        <button className="btn btn-sm w-full rounded-md">
                                                            <span className='text-violet-500'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
                                                                </svg>
                                                            </span>
                                                            PD Jobs</button>
                                                    </div>
                                                </Link>
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>

                            <div className='hidden lg:block'>
                                <Link to="/partialDelivery">
                                    <div className="indicator">
                                        <span className="indicator-item badge badge-secondary">{partialDeliveries.length}</span>
                                        <button className="btn">Partial Jobs</button>
                                    </div>
                                </Link>
                                <button onClick={handleAddJobModal} className='mx-3 bg-blue-500 text-white p-1 rounded'>Add Job</button>
                                <Link className='mx-3 bg-blue-500 text-white p-1 rounded' to={"/previousDelivery"}>Previous Job</Link>
                                <Link className='mx-3 bg-blue-500 text-white p-1 rounded' to={"/totalDelivery"}>Total Delivery</Link>
                            </div>

                            {/*user panal*/}
                            {
                                user ? <div className="dropdown dropdown-end">
                                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img src={user.photoURL ? user.photoURL : "https://static-00.iconduck.com/assets.00/user-avatar-icon-512x512-vufpcmdn.png"} />
                                        </div>
                                    </label>
                                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                        <li>
                                            <a className="justify-between">
                                                Profile
                                                <span className="badge">Comming soon</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a className="justify-between">
                                                Setting
                                                <span className="badge">Comming soon</span>
                                            </a>
                                        </li>
                                        <li><button onClick={handleLogOut}>Logout</button></li>
                                    </ul>
                                </div>
                                    :
                                    <Link to={"/login"} className='btn-primary btn-outline rounded-sm px-2 py-3'>Log In</Link>
                            }

                        </div>


                    </div>
                </div>
            </div>



        </div>
    );
};
function DeleteInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#A78BFA" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}



function EditInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
        </svg>
    )
}

function EditActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 13V16H7L16 7L13 4L4 13Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
        </svg>
    )
}

function DuplicateInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 4H12V12H4V4Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path
                d="M8 8H16V16H8V8Z"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
        </svg>
    )
}

function DuplicateActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M4 4H12V12H4V4Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path
                d="M8 8H16V16H8V8Z"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
        </svg>
    )
}

function ArchiveInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="8"
                width="10"
                height="8"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <rect
                x="4"
                y="4"
                width="12"
                height="4"
                fill="#EDE9FE"
                stroke="#A78BFA"
                strokeWidth="2"
            />
            <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}

function ArchiveActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="8"
                width="10"
                height="8"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <rect
                x="4"
                y="4"
                width="12"
                height="4"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path d="M8 12H12" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}

function MoveInactiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10 4H16V10" stroke="#A78BFA" strokeWidth="2" />
            <path d="M16 4L8 12" stroke="#A78BFA" strokeWidth="2" />
            <path d="M8 6H4V16H14V12" stroke="#A78BFA" strokeWidth="2" />
        </svg>
    )
}

function MoveActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M10 4H16V10" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M16 4L8 12" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M8 6H4V16H14V12" stroke="#C4B5FD" strokeWidth="2" />
        </svg>
    )
}


function DeleteActiveIcon(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect
                x="5"
                y="6"
                width="10"
                height="10"
                fill="#8B5CF6"
                stroke="#C4B5FD"
                strokeWidth="2"
            />
            <path d="M3 6H17" stroke="#C4B5FD" strokeWidth="2" />
            <path d="M8 6V4H12V6" stroke="#C4B5FD" strokeWidth="2" />
        </svg>
    )
}
export default Navbar;