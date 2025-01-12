import PropTypes from "prop-types";
import { doctors } from "../assets/assets";
import { createContext } from "react";

export const AppContext = createContext();
const AppContextProvider = ({ children }) => {
  const currencySymbol = "$";
  const value = {
    doctors,
    currencySymbol,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Add PropTypes validation
AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppContextProvider;
