import { Dialog, Transition } from '@headlessui/react'
import axios from 'axios';
import { Fragment } from 'react'
import Swal from 'sweetalert2';

export default function PD_Modal({ isOpen, setIsOpen, selectedJobForPartialDelivery, setSelectedJobForPartialDelivery, partialDeliveryQty, setPartialDeliveryQty }) {
  function closeModal() {
    setIsOpen(false)
  }

  
  const handlePartialDelivery = async () => {

    if (selectedJobForPartialDelivery && partialDeliveryQty > 0) {
      try {
        const response = await axios.put(
          `https://delivery-report-yunusco-back-end.vercel.app/updatePartialDelivery/${selectedJobForPartialDelivery._id}`,
          { partialDeliveryQty }
        );

        // Update the job in your state or context with the response data
        setSelectedJobForPartialDelivery(null);

        // Show SweetAlert success notification
        Swal.fire({
          icon: 'success',
          title: 'Partial Delivery Submitted',
          text: 'The partial delivery has been successfully submitted.',
          confirmButtonText: 'OK',
          onClose: () => {
            closeModal();
          },
        });
      } catch (error) {
        console.error("Error updating partial delivery:", error);
      }
    }
    closeModal()
  }

  return (
    <>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => { closeModal(); setSelectedJobForPartialDelivery(null) }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Enter Partial Quantity
                  </Dialog.Title>
                  <div className="mt-2 flex justify-center">
                    <div className="form-control">
                      <label className="input-group">
                        <input
                          type="number"
                          className="input input-md"
                          onChange={(e) => setPartialDeliveryQty(parseInt(e.target.value))}
                        />
                        <span>Piece</span>
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handlePartialDelivery}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
