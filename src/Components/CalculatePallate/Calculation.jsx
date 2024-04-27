import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from 'react-datepicker';
import { useAddJobMutation } from "../Redux/api/addJobApi";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Switch } from "@headlessui/react";
import FormField from "./FormField";
import SizeInput from "./SizeInput";
import ResultPopup from "./ResultPopup";
// import FormField from "./FormField";
// import SizeInput from "./SizeInput";

const CalculatePalette = () => {
    const [inputCount, setInputCount] = useState(2);
    const [enabled, setEnabled] = useState(true);
    const [result, setResult] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const currentDate = new Date();
    const datePickerRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(currentDate);
    const location = useNavigate()
    const [addJob, { isLoading }] = useAddJobMutation();

    const handleFocus = (index) => {
        if (index === inputCount - 1) {
            setInputCount(prevCount => prevCount + 1);
        }
    };

    const onSubmit = async (data) => {
        const { ups, label, po, customer } = data;
        if (enabled) {

            const calculateStickerDistribution = async (capacity) => {
                const sizes = Array.from({ length: inputCount }, (_, i) => parseInt(data[`size${i + 1}`]))
                    .filter(value => !isNaN(value));

                const totalQty = sizes.reduce((acc, qty) => acc + qty, 0);
                const totalSheetsNeeded = Math.ceil(totalQty / capacity);

                // Calculate the distribution for each size
                const stickerDistribution = sizes.map(qty => Math.round(qty / totalSheetsNeeded));

                // Adjust the distribution to fit within the capacity
                let totalStickersOnSheets = stickerDistribution.reduce((acc, qty) => acc + qty, 0);

                // Prioritize reduction from sizes with the largest quantities
                const maxVal = Math.max(...sizes)
                const maxUps = Math.max(...stickerDistribution)

                const maxValueCalculation = totalSheetsNeeded * maxUps

                while (maxVal > maxValueCalculation) {
                    totalSheetsNeeded++;
                }
                const jobData = { ups, label, po, customer, sizes, capacity, ExpectedDate: selectedDate, stickerDistribution, totalStickersOnSheets, impression: totalSheetsNeeded, qty: totalQty, totalCapacity: totalStickersOnSheets }

                setResult(jobData);
                return { stickerDistribution, totalSheetsNeeded, totalQty, totalStickersOnSheets };
            };
            calculateStickerDistribution(parseInt(data.ups));

        } else {
            const jobData = { qty: data.qty, label, po, customer, ExpectedDate: selectedDate };
            const res = await addJob(jobData);
            if (res?.data?.result?.insertedId) {
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Job added successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                // location('/');
            } else if (res.error?.status === 400) {
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: res?.error?.data?.message,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        }
    };

    const handlePostData = async () => {
        setResult(null);
        const res = await addJob(result);
        if (res?.data?.result?.insertedId) {
            Swal.fire({
                position: 'top-center',
                icon: 'success',
                title: 'Job added successfully',
                showConfirmButton: false,
                timer: 1500
            })
            // location('/');
        } else if (res.error?.status === 400) {
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: res?.error?.data?.message,
                showConfirmButton: false,
                timer: 1500
            });
        }
    };


    return (
        <div className="my-20 relative">
            <form className="md:w-1/2 w-3/4 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <span onClick={() => setEnabled(!enabled)} className='mx-3 cursor-pointer'>Entry</span>
                    <Switch
                        checked={enabled}
                        onChange={setEnabled}
                        className={`${enabled ? 'bg-blue-600' : 'bg-gray-800'
                            } relative inline-flex w-10 items-center rounded-full`}
                    >
                        <span className="sr-only">Enable notifications</span>
                        <span
                            className={`${enabled ? 'translate-x-6' : ''
                                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                        />
                    </Switch>
                    <span onClick={() => setEnabled(!enabled)} className='mx-3 cursor-pointer'>Calculate</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Customer" register={register} id="customer" error={errors.customer} required />
                    <FormField label="Job No" register={register} id="po" error={errors.po} required />
                    <FormField label="Label Name" register={register} id="label" error={errors.label} required />

                    <div className="flex flex-col mb-5 ml-[16px] w-[256px]">
                        <label htmlFor="title" className="mb-2">
                            Expected Delivery Date
                        </label>
                        <DatePicker
                            className='w-[242px] md:w-[333px] rounded-md uppercase'
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="dd/MM/yyyy"
                            ref={datePickerRef}
                        />
                    </div>
                    <div className="inline">
                        {enabled ? (
                            <SizeInput inputCount={inputCount} register={register} handleFocus={handleFocus} errors={errors} />
                        ) : (
                            <FormField label="Total Quantity" register={register} id="qty" error={errors.qty} required />
                        )}
                    </div>
                </div>
                <motion.button
                    initial={{ scale: 0.9 }}
                    animate={{
                        rotate: 0,
                        scale: 1,
                        transition: { duration: 0.2 }
                    }}
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 float-right py-2 px-4 rounded"
                    type="submit"
                >
                    {enabled ? 'Calculate' : 'Submit'}
                </motion.button>
            </form>
            <AnimatePresence>
                {result && (
                    <ResultPopup result={result} handlePostData={handlePostData} isLoading={isLoading} setResult={setResult} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalculatePalette;
