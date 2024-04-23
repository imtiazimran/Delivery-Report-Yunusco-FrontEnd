import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion"
const CalculatePalette = () => {
    const [inputCount, setInputCount] = useState(2);
    const [result, setResult] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const handleFocus = (index) => {
        if (index === inputCount - 1) {
            setInputCount(prevCount => prevCount + 1);
        }
    };

    const onSubmit = (data) => {
        const calculateStickerDistribution = (capacity, sizes) => {
            let totalQty = sizes.reduce((acc, qty) => acc + qty, 0);
            let totalSheetsNeeded = Math.ceil(totalQty / parseInt(capacity));
            let stickerDistribution = sizes.map(qty => Math.ceil(qty / totalSheetsNeeded));
            let totalStickersOnSheets = stickerDistribution.reduce((acc, qty) => acc + qty, 0);
    
            // Check if each sticker distribution meets the capacity
            for (let i = 0; i < sizes.length; i++) {
                while (stickerDistribution[i] * totalSheetsNeeded < sizes[i]) {
                    totalSheetsNeeded++;
                    totalStickersOnSheets += sizes[i];
                    stickerDistribution = sizes.map(qty => Math.ceil(qty / totalSheetsNeeded));
                }
            }
    
            return { stickerDistribution, totalSheetsNeeded, totalQty, totalStickersOnSheets };
        };

        const inputs = Array.from({ length: inputCount }, (_, i) => parseInt(data[`size${i + 1}`]))
            .filter(value => !isNaN(value));

        const calculation = calculateStickerDistribution(data.ups, inputs);
        setResult(calculation);
    };


    return (
        <div className="my-20 relative">
            <form className="md:w-1/2 w-3/4 mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ups">Tray Capacity</label>
                        <motion.input
                            initial={{ scale: 0.8 }}
                            animate={{
                                rotate: 0,
                                scale: 0.9,
                                transition: { duration: 0.3 }
                            }}
                            whileFocus={{
                                scale: 1
                            }}
                            {...register('ups', { required: true })} className="w-full border-gray-500 focus:ring-purple-600" type="number" id="ups" />
                        {errors.ups && <p className="text-red-500">This field is required</p>}
                    </div>
                    {
                        Array.from({ length: inputCount }).map((_, index) => (
                            <div key={index}>
                                <label htmlFor={`size${index + 1}`}>Size {index + 1}</label>
                                <motion.input
                                    initial={{ scale: 0.8 }}
                                    animate={{
                                        rotate: 0,
                                        scale: 0.9,
                                        transition: { duration: 0.3 }
                                    }}
                                    whileFocus={{
                                        scale: 1,
                                        shadow: "0 0 0 2px #000000"
                                    }}
                                    {...register(`size${index + 1}`)}
                                    className="w-full border-gray-500 focus:ring-purple-600"
                                    type="number"
                                    id={`size${index + 1}`}
                                    onFocus={() => handleFocus(index)}
                                />
                            </div>
                        ))
                    }
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 float-right py-2 px-4 rounded" type="submit">
                    Calculate</motion.button>
            </form>
            <AnimatePresence>
                {result && (
                    <motion.div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div className="bg-white p-4 rounded shadow-lg w-[300px]"
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -50, opacity: 0 }}
                        >
                            <h5>Impression: {result.totalSheetsNeeded}</h5>
                            <h2>Total Capacity: {result.totalStickersOnSheets}</h2>
                            <h3>Total Quantity: {result.totalQty}</h3>
                            <h4>Sticker Distribution: {result.stickerDistribution.map((s, i) => <span className="mx-1" key={i}>{s}</span>)}</h4>
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
                                onClick={() => setResult(null)}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 float-right py-2 px-4 rounded"
                                type="submit">
                                Close</motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalculatePalette;
