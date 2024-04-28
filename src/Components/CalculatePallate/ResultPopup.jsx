import {AnimatePresence, motion} from "framer-motion"
const ResultPopup = ({ result, handlePostData, isLoading, setResult }) => {
    return (
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
                        <h5>Impression: {result.impression}</h5>
                        <h2>Total Capacity: {result?.totalStickersOnSheets}</h2>
                        <h3>Total Stickers: {result?.ups}</h3>
                        <h3>Total Quantity: {result?.qty}</h3>
                        <h4 className="grid grid-cols-4">Sizes: {result?.sizes?.map((s, i) => <span className="mx-1" key={i}>{s}</span>)}</h4>
                        <h4 className="grid grid-cols-5">Ups: {result?.stickerDistribution?.map((s, i) => <span className="mx-1" key={i}>{s}</span>)}</h4>
                        <h4 className="grid grid-cols-5">Output: {result?.outputAfterDistribution?.map((s, i) => <span className="mx-1" key={i}>{s}</span>)}</h4>
                        <motion.button
                            initial={{ scale: 0.9 }}
                            animate={{
                                rotate: 0,
                                scale: 1,
                                transition: {
                                    duration: 0.2
                                }
                            }}
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onClick={handlePostData}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 float-right py-2 px-4 mx-4 rounded"
                            type="submit">
                            {isLoading ? "Saving..." : "Save"}</motion.button>
                        <motion.button
                            initial={{ scale: 0.9 }}
                            animate={{
                                rotate: 0,
                                scale: 1,
                                transition: {
                                    duration: 0.2
                                }
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
    );
};

export default ResultPopup;