import axios from "axios";
import React, { useRef, useState } from "react";
import { useContext } from "react";
import Swal from "sweetalert2";
import Lottie from "lottie-react";
import Loader from "../../assets/loader2.json";
import { JobContext } from "../Context/JobProvider";
import { Switch } from "@headlessui/react";
import DatePicker from "react-datepicker";
import { AuthContext } from "../Context/AuthProvider";
import { useForm } from "react-hook-form";
const AddSample = ({ setIsOpen, isOpen }) => {
  // console.log( isOpen);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  const { AddSample, isLoading, setIsLoading } = useContext(JobContext);
  const [enabled, setEnabled] = useState(false);
  const { user } = useContext(AuthContext);
  const currentDate = new Date();
  const datePickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const onSubmit = (e) => {
    if (user) {
      setIsLoading(true);
      const sample = {
        ...e,
        EntryDate: new Date(),
        AddedBy: user?.displayName ? user?.displayName : user?.email,
        qty: parseInt(e?.qty),
        ...(enabled
          ? { DeliveryDate: selectedDate, Status: "Delivered" }
          : { ReceiveDate: selectedDate, Status: "Pending" }),
      };
      AddSample(sample);
      reset()
      console.log(sample);
      setIsOpen(false);
    } else {
      setIsOpen(false);
      setIsLoading(false);
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "No User Found",
        text: "Please log In to add Samples",
        confirmButtonText: "Login",
        showConfirmButton: true,
        showCancelButton: true,
      }).then(() => {
        window.location = "/login";
      });
    }
  };
  const handleDatePickerChange = (date) => {
    setSelectedDate(date);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  if (isOpen) {
    document.getElementById("addSample").showModal();
  } else {
    document.getElementById("addSample")?.close();
  }

  return (
    <div>
      <dialog id="addSample" className="modal">
        {isLoading ? (
          <Lottie className="lg:w-1/4 mx-auto" animationData={Loader} />
        ) : (
          <div className="modal-box">
            <div className="flex ">
              <div>
                <span
                  onClick={() => setEnabled(!enabled)}
                  className="mx-3 cursor-pointer"
                >
                  Pending
                </span>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  className={`${
                    enabled ? "bg-blue-600" : "bg-gray-800"
                  } relative inline-flex w-10 items-center rounded-full`}
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    className={`${
                      enabled ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                  />
                </Switch>
                <span
                  onClick={() => setEnabled(!enabled)}
                  className="mx-3 cursor-pointer"
                >
                  Delivered
                </span>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="btn btn-sm btn-outline absolute right-2 top-2"
            >
              Close
            </button>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="lg:w-3/4 mx-auto py-10 w-3/4"
            >
              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  From
                </label>
                <input
                  required
                  className="w-full rounded-md capitalize"
                  type="text"
                  id="title"
                  name="from"
                  placeholder="Gazi Faysal Rayhan"
                  {...register("from", { required: true })}
                />
                <p>{errors.from?.message}</p>
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  To
                </label>
                <input
                  required
                  className="w-full rounded-md capitalize"
                  type="text"
                  id="title"
                  name="to"
                  placeholder="Monowara"
                  {...register("to", { required: true })}
                />
                <p>{errors.to?.message}</p>
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  Customer
                </label>
                <input
                  required
                  className="w-full rounded-md capitalize"
                  type="text"
                  id="title"
                  name="customar"
                  placeholder="Exp: Apex Textile"
                  {...register("customer", { required: true })}
                />
                <p>{errors.customar?.message}</p>
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  Brand
                </label>
                <input
                  required
                  className="w-full rounded-md uppercase"
                  type="text"
                  id="title"
                  name="brand"
                  placeholder="H&M"
                  {...register("brand", { required: true })}
                />
                <p>{errors.brand?.message}</p>
              </div>

              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  Label Name
                </label>
                <input
                  required
                  className="w-full rounded-md uppercase"
                  type="text"
                  id="title"
                  name="label"
                  placeholder="Exp: HM14149"
                  {...register("label", { required: true })}
                />
                <p>{errors.label?.message}</p>
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  Color
                </label>
                <input
                  required
                  className="w-full rounded-md uppercase"
                  type="text"
                  id="title"
                  name="color"
                  placeholder="Exp: 144103"
                  {...register("color", { required: true })}
                />
                <p>{errors.color?.message}</p>
              </div>

              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  ST No.
                </label>
                <input
                  required
                  className="w-full rounded-md uppercase"
                  type="text"
                  id="title"
                  name="stNo"
                  placeholder="Exp: HM14149"
                  {...register("stNo", { required: true })}
                />
                <p>{errors.stNo?.message}</p>
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  Size
                </label>
                <input
                  required
                  className="w-full rounded-md uppercase"
                  type="text"
                  id="title"
                  name="size"
                  placeholder="Exp: HM14149"
                  {...register("size", { required: true })}
                />
                <p>{errors.size?.message}</p>
              </div>
              <div className="flex flex-col mb-5">
                <label htmlFor="title" className="mb-2">
                  Quantity
                </label>
                <input
                  required
                  className="w-full rounded-md uppercase"
                  type="text"
                  id="title"
                  name="size"
                  placeholder="Exp: 50pcs"
                  {...register("qty", { required: true })}
                />
                <p>{errors.qty?.message}</p>
              </div>
              {enabled ? (
                <div className="flex flex-col mb-5">
                  <label htmlFor="title" className="mb-2">
                    Delivery Date
                  </label>
                  <DatePicker
                    className="w-full rounded-md uppercase"
                    selected={selectedDate}
                    onChange={handleDatePickerChange}
                    dateFormat="dd/MM/yyyy"
                    ref={datePickerRef}
                  />
                </div>
              ) : (
                <div className="flex flex-col mb-5">
                  <label htmlFor="title" className="mb-2">
                    Receive Date
                  </label>
                  <DatePicker
                    className="w-full rounded-md uppercase"
                    selected={selectedDate}
                    onChange={handleDatePickerChange}
                    dateFormat="dd/MM/yyyy"
                    ref={datePickerRef}
                  />
                </div>
              )}

              <button
                disabled={isLoading}
                type="submit"
                className="btn btn-outline btn-info btn-sm"
              >
                {" "}
                {isLoading ? (
                  <span className="loading loading-infinity loading-md"></span>
                ) : (
                  <span>Submit</span>
                )}
              </button>
            </form>
          </div>
        )}
      </dialog>
    </div>
  );
};

export default AddSample;
