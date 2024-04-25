
import { motion } from "framer-motion"
import { useContext, useState } from "react";
import { JobContext } from "./Context/JobProvider";
import PD_Modal from "./ui/Modal";
import EmptyAmimation from "../assets/Empty-Animation.json"
import Loader from "../assets/loader2.json"
import Lottie from "lottie-react";
import { AuthContext } from "./Context/AuthProvider";
import { useDeleteJobMutation, useGetProcessingJobsQuery } from "./Redux/api/addJobApi";
import Swal from "sweetalert2";
import { AnimatePresence } from "framer-motion";
const JobOnProcessing = () => {
    const { user } = useContext(AuthContext)
    const {
        // jobs,
        // isLoading,
        // handleDelete,
        handleDeliveredJob,
        isOpen,
        setIsOpen,
        selectedJobForPartialDelivery,
        setSelectedJobForPartialDelivery,
        partialDeliveryQty,
        setPartialDeliveryQty
    } = useContext(JobContext)

    const { data, isLoading, refetch } = useGetProcessingJobsQuery()
    const [deleteJob, { isSuccess }] = useDeleteJobMutation()
    const [selectedId, setSelectedId] = useState(null)
    const handlePartialDeliveryModal = (job) => {
        setSelectedJobForPartialDelivery(job);
        setPartialDeliveryQty(0); // Reset input field
        setIsOpen(true)
    };

    const onProccess = data?.filter((item) => !item.hasOwnProperty("deliveryType"))


    const currentDeliveryQty = onProccess?.reduce((accumolator, currentJob) => accumolator + parseInt(currentJob.qty), 0)

    const handleDelete = (job) => {

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    setSelectedId(null)
                    deleteJob(job._id)
                    refetch()
                }
            })
    }

    const expectedDate = new Date(selectedId?.ExpectedDate);

    return (
        <div className="pb-16">
            <PD_Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                selectedJobForPartialDelivery={selectedJobForPartialDelivery}
                setSelectedJobForPartialDelivery={setSelectedJobForPartialDelivery}
                partialDeliveryQty={partialDeliveryQty}
                setPartialDeliveryQty={setPartialDeliveryQty}
            />

            {onProccess?.length === 0 || (
                <div className="rounded-xl md:w-11/12 mx-auto text-2xl py-3 bg-sky-700 text-white text-center">
                    <span className="loading loading-ring loading-xs"></span> Jobs On Processing{" "}
                    <span className="loading loading-ring loading-xs"></span>
                </div>
            )}

            <div className="overflow-x-auto mx-auto text-white">
                {isLoading ? (
                    <div>
                        <div className="text-center">
                            <Lottie className="lg:w-2/4 mx-auto" animationData={Loader} />
                        </div>
                    </div>
                ) : onProccess?.length === 0 ? (
                    <div className="mt-5 ">
                        <span className="lg:text-2xl text-xl bg-cyan-900 text-white py-4 text-center block font-semibold md:w-1/4 mx-auto lg:absolute top-1/4 z-50">
                            No Job is in Processing <br />
                            Please Add some Jobs First
                        </span>
                        <Lottie className="lg:w-2/4 mx-auto" animationData={EmptyAmimation} />
                    </div>
                ) : (
                    // The table code can go here
                    <table className="table md:w-11/12 mx-auto">
                        {/* head */}
                        {onProccess.length === 0 || (
                            <thead>
                                <tr className="text-center text-white">
                                    <th>#</th>
                                    <th>Customer</th>
                                    <th>Job</th>
                                    <th>Quantity</th>
                                    <th>Label Name</th>
                                    {/* <th>Action</th> */}
                                </tr>
                            </thead>
                        )}
                        <tbody>
                            {onProccess?.map((job, i) => (

                                <motion.tr layoutId={job._id}  key={job._id} className="text-center py-16">
                                        <th  onClick={() => setSelectedId(job)}>{i + 1}</th>
                                        <td  onClick={() => setSelectedId(job)} className="capitalize">{job?.customer}</td>
                                        <td  onClick={() => setSelectedId(job)}>JBH000{job?.po}</td>
                                        <td  onClick={() => setSelectedId(job)}>{job?.qty.toLocaleString("en-IN")}</td>
                                        <td  onClick={() => setSelectedId(job)} className="uppercase">{job?.label}</td>
                                        <td>
                                            <button onClick={() => handleDeliveredJob({ ...job, markedBy: user?.displayName ? user?.displayName : user?.email })} className="btn-md btn-success btn-outline rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>

                                            </button>
                                            <button onClick={() => handlePartialDeliveryModal(job)} className="btn-md btn-primary btn-outline rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
                                                </svg>

                                            </button>
                                            <button onClick={() => handleDelete(job)} className="btn-md btn-error btn-outline rounded">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </td>
                                </motion.tr>
                            ))}
                        </tbody>
                        <tfoot>
                            {onProccess?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center"></td>
                                </tr>
                            ) : (
                                <tr className="text-center bg-yellow-600">
                                    <th>#</th>
                                    <th></th>
                                    <th className="text-xl text-white">Total Quantity</th>
                                    <th className="text-xl text-white">{currentDeliveryQty.toLocaleString("en-IN")} Piece</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            )}
                        </tfoot>
                    </table>
                )}
            </div>
            <AnimatePresence className="flex justify-center items-center">
                {
                    selectedId && (
                        <motion.div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center" layoutId={selectedId._id}>
                            <div className="bg-white p-4  w-[350px] text-black">

                                <h1 className="text-black">PO: JBH000{selectedId?.po}</h1>
                                <p className="text-black">Customer : {selectedId?.customer}</p>
                                <p className="text-black">Quantity : {selectedId?.qty.toLocaleString('en-IN')}</p>
                                <p className="text-black">Impression : {selectedId?.impression}</p>
                                <p className="text-black">Capacity : {selectedId?.capacity}</p>
                                <p className="text-black">Label : {selectedId?.label}</p>
                                <p className="text-black">Expected Delivery : {expectedDate?.toLocaleDateString()}</p>
                                <p className="grid grid-cols-6">
                                    Size:
                                    {
                                        selectedId.sizes.map((s, i) => <span className="text-black mx-2" key={i}>{s}</span>)
                                    }
                                </p>
                                <p cla>
                                    Ups per size:
                                    {
                                        selectedId.stickerDistribution.map((s, i) => <span className="text-black mx-2" key={i}>{s}</span>)
                                    }
                                </p>
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
                                    onClick={() => setSelectedId(null)}
                                >
                                    Close
                                </motion.button>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    );

};

export default JobOnProcessing;