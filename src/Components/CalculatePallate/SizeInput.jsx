import {motion} from "framer-motion"
const SizeInput = ({ inputCount, register, handleFocus, errors }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {...register('ups')}
                className="w-full border-gray-500 focus:ring-purple-600"
                type="number"
                id="ups"
            />
            {errors.ups && <p className="text-red-500">This field is required</p>}
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
    );
}
export default SizeInput