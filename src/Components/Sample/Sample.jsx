import React, { useContext, useState } from 'react';
import { JobContext } from '../Context/JobProvider';
import { Tab } from '@headlessui/react';
import moment from 'moment';

const Sample = () => {
    const { sample, isLoading, deleteSample, updateSample } = useContext(JobContext);
    const [searchQuery, setSearchQuery] = useState('');
    const pendingSamples = sample.filter(sample => sample.Status === "Pending");
    const DeliveredSamples = sample.filter(sample => sample.Status === "Delivered");
    const categories = {
        "Pending Samples": pendingSamples,
        "Delivered Samples": DeliveredSamples,
        "All Samples": sample
    };

    // console.log(categories)


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    const filteredCategories = Object.keys(categories).reduce((acc, category) => {
        acc[category] = categories[category].filter(sample => {
            const values = Object.values(sample).join('').toLowerCase();
            return values.includes(searchQuery.toLowerCase());
        });
        return acc;
    }, {});
    return (
        <div className='mt-20 mb-10 flex justify-center'>
            <div className="w-full max-w-md px-2 py-16 sm:px-0">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full mb-4 px-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none"
                />
                <Tab.Group>
                    <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                        {Object.keys(filteredCategories).map((category) => (
                            <Tab
                                key={category}
                                className={({ selected }) =>
                                    classNames(
                                        'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                                        'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                        selected
                                            ? 'bg-white text-blue-700 shadow'
                                            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                                    )
                                }
                            >
                                {category}
                            </Tab>
                        ))}
                    </Tab.List>
                    <Tab.Panels className="mt-2">
                        {Object.values(filteredCategories).map((posts, idx) => (
                            <Tab.Panel
                                key={idx}
                                className={classNames(
                                    'rounded-xl bg-white p-3',
                                    'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                                )}
                            >
                                {
                                    posts.length === 0 && <h3 className="text-md text-red-500 text-center font-medium leading-5 capitalize">No Data Found</h3>
                                }
                                <ul>
                                    {posts.map((post) => (
                                        <li
                                            key={post._id}
                                            onDoubleClick={() => deleteSample(post._id)}
                                            className="relative rounded-md p-3 hover:bg-gray-100"
                                        >
                                            <div className='flex justify-between items-center'>
                                                <h3 className="text-lg font-medium leading-5 capitalize">
                                                    {post.customer}
                                                </h3>
                                                {
                                                    post.Status === "Pending" &&
                                                    <button onClick={() => updateSample({ ...post, Status: "Delivered", DeliveryDate: new Date() })} className='absolute right-2 text-green-600 hover:text-blue-600'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                        </svg>
                                                    </button>
                                                }
                                            </div>

                                            <ul className="mt-1 flex justify-between text-sm font-normal leading-4 text-gray-500">
                                                <li>
                                                    <li className='capitalize'>From: {post.from}</li>
                                                    <li className='capitalize'>To: {post.to}</li>
                                                    <li className='capitalize'>Brand: <span className='uppercase'>{post.brand}</span></li>
                                                    <li className='capitalize'>Color: {post.color}</li>
                                                    <li className='capitalize'>St No: {post.stNo}</li>
                                                    {post.DeliveryDate && (
                                                        <li>Delivery Date: {moment(post.DeliveryDate).format('DD/MM/YYYY')}</li>
                                                    )}

                                                    {post.ReceiveDate && (
                                                        <li>Receive Date: {moment(post.ReceiveDate).format('DD/MM/YYYY')}</li>
                                                    )}

                                                </li>
                                                <li>
                                                    <li className='capitalize'>Label: <span className='uppercase'>{post.label}</span> </li>
                                                    <li>Quantity: {post.qty}</li>
                                                    <li className='capitalize'>Size: <span className='uppercase'>{post.size}</span> </li>
                                                    <li>Added By: {post.AddedBy}</li>
                                                    <li className='capitalize' >Status: <span className='uppercase'>{post.Status}</span> </li>

                                                </li>
                                            </ul>
                                        </li>
                                    ))}
                                </ul>
                            </Tab.Panel>
                        ))
                        }
                    </Tab.Panels>

                </Tab.Group>
            </div>
        </div>
    );
};

export default Sample;
