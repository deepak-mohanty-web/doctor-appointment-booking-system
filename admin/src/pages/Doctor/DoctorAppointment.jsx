import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets";

function DoctorAppointment() {
  const {
    appointments,
    getAppointment,
    dToken,
    slotDateFormat,
    calculateAge,
    completeAppointment,
    cancleAppointment,
  } = useContext(DoctorContext);
  useEffect(() => {
    if (dToken) {
      getAppointment();
    }
  }, [dToken]);
  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-semibold">All Appointments</p>
      <div className="bg-white border rounded max-h-[80vh] min-h-[50vh] overfolw-y-auto">
        <div className=" max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b">
          <p className="font-semibold">#</p>
          <p className="font-semibold">Patient</p>
          <p className="font-semibold">Payment</p>
          <p className="font-semibold">Age</p>
          <p className="font-semibold">Date & Time</p>
          <p className="font-semibold">Fee</p>
          <p className="font-semibold">Action</p>
        </div>
        {appointments.reverse().map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap justify-between gap-2 max-sm:grid-2 sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr] items-center text-gary-500 py-3 px-6 border-b hover:bg-gray-50"
          >
            <p className="max-sm:hidden">{index + 1}</p>
            <div className="flex items-center gap-2">
              <img
                className="w-8 rounded-full"
                src={item.userData.image}
                alt=""
              />
              <p>{item.userData.name}</p>
            </div>
            <div>
              <p className="text-xs inline border border-primary px-2 rounded-full text-gray-500">
                {item.payment ? "ONLINE" : "CASH"}
              </p>
            </div>
            <p className="max-sm:hidden">{calculateAge(item.userData.dob)}</p>
            <p className="text-sm font-mono">
              {slotDateFormat(item.slotDate)},{item.slotTime}
            </p>
            <p>${item.amount}</p>
            {item.cancelled ? (
              <p className="text-sm font-semibold text-red-500">Cancelled</p>
            ) : item.isCompleted ? (
              <p className="text-sm font-semibold text-green-500">Completed</p>
            ) : (
              <div className="flex">
                <img
                  onClick={() => cancleAppointment(item._id)}
                  className="w-12 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className="w-12 cursor-pointer"
                  src={assets.tick_icon}
                  alt=""
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorAppointment;
