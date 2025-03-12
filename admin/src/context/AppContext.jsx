import { createContext } from "react";
import { PropTypes } from "prop-types";
export const AppContext = createContext();

const AppContextProvider = (props) => {
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

  const value = {
    calculateAge,
    slotDateFormat,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppContextProvider;
