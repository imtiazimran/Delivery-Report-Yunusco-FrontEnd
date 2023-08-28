import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AddJobs = () => {
    const [isLoading, setIsloading] = useState(false)
    const handleSubmit = e => {
        setIsloading(true)
        e.preventDefault()
        const form = e.target;
        const customar = form.customar.value
        const po = form.po.value
        const qty = form.qty.value
        const label = form.label.value

        const addJobs = {
            customar, po, qty, label
        }

        axios.post('https://delivery-report-yunusco-back-end.vercel.app/addJobs', addJobs)
            .then(res => {
                setIsloading(false)
                if (res.data.insertedId) {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'success',
                        title: 'Job Added',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    form.reset();
                }
            })
            .catch(error => {
                setIsloading(false)
                if (error.response && error.response.status === 400) {
                    Swal.fire({
                        position: 'top-center',
                        icon: 'error',
                        title: 'Job Already Exists',
                        text: 'Job with this PO already exists.',
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
    }

    return (
        <form onSubmit={handleSubmit} className='lg:w-2/4 mx-auto py-10'>
            <div className="form-control my-5">
                <label className="input-group input-group-vertical">
                    <span>Customar</span>
                    <input name='customar' type="text" placeholder="Exp: Apex Textile" className="input input-bordered capitalize" />
                </label>
            </div>
            <div className="form-control my-5">
                <label className="input-group input-group-vertical">
                    <span>Job No</span>
                    <input name='po' type="text" placeholder="Exp: JBH00342050" className="input input-bordered " />
                </label>
            </div>
            <div className="form-control my-5">
                <label className="input-group input-group-vertical">
                    <span>Quantity</span>
                    <input name='qty' type="text" placeholder="Qty" className="input input-bordered " />
                </label>
            </div>
            <div className="form-control my-5">
                <label className="input-group input-group-vertical">
                    <span>Label Name</span>
                    <input name='label' type="text" placeholder="Exp: HM14149" className="input input-bordered uppercase" />
                </label>
            </div>
            <button disabled={isLoading} type="submit" className='bg-orange-700 w-full text-white p-1 rounded'> {
                isLoading ? <span className="loading loading-infinity loading-md"></span> : <span>Submit</span>
            }</button>
        </form>
    );
};

export default AddJobs;