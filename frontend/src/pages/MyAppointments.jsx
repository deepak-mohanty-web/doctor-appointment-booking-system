import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { PuffLoader } from "react-spinners";

function MyAppointments() {
  const { backendUrl, token, getAllDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getUserAppointment = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/list-appointment",
        { headers: { token } }
      );

      if (data.success && Array.isArray(data.appointmentData)) {
        console.log(data.appointmentData);
        setAppointments(data.appointmentData.reverse());
      } else {
        setAppointments([]);
        toast.warn("No appointments found");
      }
    } catch (error) {
      console.log("Error:", error);
      setAppointments([]);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointment();
    }
  }, [token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      console.log(appointmentId);
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      console.log(data);
      if (data.success) {
        toast.success(data.message, {
          icon: "☹️",
        });
        getUserAppointment();
        getAllDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";

      toast.error(errorMessage);
    }
  };
  const initPay = (order) => {
    const options = {
      key: import.meta.env.RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            { headers: { token } }
          );
          if (data.success) {
            getUserAppointment();
          }
        } catch (error) {
          console.log(error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong";

          toast.error(errorMessage);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };
  const appointmentRazorpay = async (appointmentId) => {
    const { data } = await axios.post(
      backendUrl + "/api/user/payment-razorpay",
      { appointmentId },
      { headers: { token } }
    );
    if (data.success) {
      initPay(data.order);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <PuffLoader />
      </div>
    );
  }

  return (
    <div>
      <p className="pb-3 mt-12 border-b text-zinc-700 font-medium">
        My Appointments
      </p>
      <div>
        {Array.isArray(appointments) && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_2fr] sm:flex gap-4 sm:gap-6 py-2 border-b"
              key={index}
            >
              <img
                className="w-32 bg-indigo-50"
                src={item.docData.image}
                alt=""
              />
              <div className="flex-1 text-sm text-zinc-600">
                <p className="font-semibold text-lg text-black">
                  {item.docData.name}
                </p>
                <p>{item.docData.speciality}</p>
                <p className="font-medium  text-zinc-700 mt-1">Address:</p>
                <p className="text-xs">{item.docData.address.line1}</p>
                <p className="text-xs">{item.docData.address.line2}</p>
                <p className="text-sm mt-1">
                  <span className="font-medium text-zinc-700 text-sm">
                    Date & Time:
                  </span>
                  {item.slotDate} | {item.slotTime}
                </p>
              </div>
              <div></div>
              <div className="flex flex-col justify-end gap-2">
                {!item.cancelled && item.payment && !item.isCompleted && (
                  <button className="text-sm text-center text-stone-500 border sm:min-w-48 rounded py-2 bg-indigo-100">
                    Paid
                  </button>
                )}
                {!item.cancelled && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => appointmentRazorpay(item._id)}
                    className="text-sm text-center text-stone-700 border sm:min-w-48 rounded py-2 hover:bg-blue-500 hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}
                {!item.cancelled && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="text-sm text-center text-stone-700 border sm:min-w-48 rounded py-2  hover:bg-red-500 hover:text-white transition-all duration-300"
                  >
                    Cancel appointment
                  </button>
                )}
                {item.cancelled && !item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                    Appointment Cancelled
                  </button>
                )}
                {item.isCompleted && (
                  <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 bg-green-50">
                    Completed
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
}
export default MyAppointments;
