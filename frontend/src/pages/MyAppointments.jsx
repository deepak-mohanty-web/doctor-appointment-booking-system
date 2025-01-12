import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function MyAppointments() {
  const { doctors } = useContext(AppContext);
  return (
    <div>
      <p className="pb-3 mt-12 border-b text-zinc-700 font-medium">
        My Appointments
      </p>
      <div>
        {doctors.slice(0, 2).map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] sm:flex gap-4 sm:gap-6 py-2 border-b"
            key={index}
          >
            <img className="w-32 bg-indigo-50" src={item.image} alt="" />
            <div className="flex-1 text-sm text-zinc-600">
              <p className="font-semibold text-lg text-black">{item.name}</p>
              <p>{item.speciality}</p>
              <p className="font-medium  text-zinc-700 mt-1">Address:</p>
              <p className="text-xs">{item.address.line1}</p>
              <p className="text-xs">{item.address.line2}</p>
              <p className="text-sm mt-1">
                <span className="font-medium text-zinc-700 text-sm">
                  Date & Time:
                </span>
                12 Feb 2025 | 11:30 AM
              </p>
            </div>
            <div></div>
            <div className="flex flex-col justify-end gap-2">
              <button className="text-sm text-center text-stone-700 border sm:min-w-48 rounded py-2 hover:bg-blue-500 hover:text-white transition-all duration-300">
                Pay Online
              </button>
              <button className="text-sm text-center text-stone-700 border sm:min-w-48 rounded py-2  hover:bg-red-500 hover:text-white transition-all duration-300">
                Cancle appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointments;
