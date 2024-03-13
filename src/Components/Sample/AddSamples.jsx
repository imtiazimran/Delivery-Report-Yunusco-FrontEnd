import React from 'react';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';

const AddSamples = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            receiveDate: new Date(),
        },
    });

    const handleDatePickerChange = (date) => {
        // Update form state using register.setValue
        register.setValue('receiveDate', date);
    };

    const onSubmit = (data) => {
        console.log(data);
        // Submit form data here
    };

    return (
        <div className='my-20'>
            <form className='w-2/4 mx-auto' onSubmit={handleSubmit(onSubmit)}>
                <label className="input input-bordered flex items-center gap-2">
                    From
                    <input type="text" className="" placeholder="From" {...register('from')} />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    To
                    <input type="text" className="" placeholder="To" {...register('to')} />
                </label>
                <div className="flex flex-col mb-5">
                    <label htmlFor="title" className="mb-2">
                        Receive Date
                    </label>
                    <DatePicker
                        className="w-full rounded-md uppercase"
                        selected={register('receiveDate').value}
                        onChange={handleDatePickerChange}
                        dateFormat="dd/MM/yyyy"
                    />
                    {/* Display any errors for receiveDate */}
                    {errors.receiveDate && (
                        <span className="text-red-500">{errors.receiveDate.message}</span>
                    )}
                </div>
                <label className="input input-bordered flex items-center gap-2">
                    Customer Name
                    <input
                        type="text"
                        className=""
                        placeholder="Customer Name"
                        {...register('customerName')}
                    />
                </label>
                {/* Register all remaining inputs */}
                <label className="input input-bordered flex items-center gap-2">
                    Brand
                    <input
                        type="text"
                        className=""
                        placeholder="Brand"
                        {...register('brand')}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Label Name
                    <input
                        type="text"
                        className=""
                        placeholder="Search"
                        {...register('labelName')}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Colour
                    <input
                        type="text"
                        className=""
                        placeholder="Search"
                        {...register('colour')}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    ST No.
                    <input
                        type="text"
                        className=""
                        placeholder="Search"
                        {...register('stNo')}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Size
                    <input type="text" className="" placeholder="Search" {...register('size')} />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    Quantity
                    <input
                        type="text"
                        className=""
                        placeholder="Search"
                        {...register('quantity')}
                    />
                </label>

                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default AddSamples;
