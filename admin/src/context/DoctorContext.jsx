import { createContext, useEffect, useState } from "react";
import { PropTypes } from "prop-types";
export const DoctorContext = createContext();
import axios from "axios";
import { toast } from "react-hot-toast";

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [dToken, setDToken] = useState(localStorage.getItem("dToken") || "");
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  const getAppointment = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: { dtoken: dToken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const cancleAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancle-appointment",
        { appointmentId },
        { headers: { dtoken: dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointment();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };
  const getDashdata = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dtoken: dToken },
      });
      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dtoken: dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log(data.profileData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDay = new Date(dob);

    let age = today.getFullYear() - birthDay.getFullYear();
    return age;
  };
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_"); // Assuming format: "DD_MM_YYYY"
    const day = Number(dateArray[0]);
    const month = Number(dateArray[1]);
    const year = dateArray[2];

    const months = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Function to get the ordinal suffix (st, nd, rd, th)
    const getOrdinalSuffix = (day) => {
      if (day > 10 && day < 20) return "th"; // Special case for 11-19
      const lastDigit = day % 10;
      if (lastDigit === 1) return "st";
      if (lastDigit === 2) return "nd";
      if (lastDigit === 3) return "rd";
      return "th";
    };
    return `${day}${getOrdinalSuffix(day)} ${months[month]} ${year}`;
  };
  useEffect(() => {
    if (dToken) {
      console.log("DoctorContext: Token updated, saving to localStorage");
      localStorage.setItem("dToken", dToken);
    }
  }, [dToken]);

  const value = {
    backendUrl,
    dToken,
    setDToken,
    setAppointments,
    appointments,
    getAppointment,
    slotDateFormat,
    calculateAge,
    completeAppointment,
    cancleAppointment,
    dashData,
    setDashData,
    getDashdata,
    getProfileData,
    setProfileData,
    profileData,
  };
  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};
DoctorContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default DoctorContextProvider;
