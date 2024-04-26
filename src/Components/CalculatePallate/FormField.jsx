import {motion} from "framer-motion"
const FormField = ({ label, register, id, error, required }) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
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
                {...register(id, { required })}
                className="w-full border-gray-500 focus:ring-purple-600"
                type="text"
                id={id}
            />
            {error && <p className="text-red-500">This field is required</p>}
        </div>
    );
};
export default FormField;