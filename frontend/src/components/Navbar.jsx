import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState } from "react";
function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  return (
    <div className="flex items-center justify-between py-4 text-sm border-b border-b-gray-400 mb-5">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt=""
      />
      <ul className="hidden md:flex gap-5 font-medium flex-start">
        <NavLink to="/">
          <li className="py-1">Home</li>
          <hr className=" border-none outline-none h-0.5 bg-[#5F6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="py-1">All Doctors</li>
          <hr className="border-none outline-none h-0.5 bg-[#5F6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/about">
          <li className="py-1">About</li>
          <hr className="border-none outline-none h-0.5 bg-[#5F6FFF] w-3/5 m-auto hidden" />
        </NavLink>
        <NavLink to="/contact">
          <li className="py-1">Contact</li>
          <hr className="border-none outline-none h-0.5 bg-[#5F6FFF] w-3/5 m-auto hidden" />
        </NavLink>
      </ul>
      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-2 group relative cursor-pointer">
            <img className="w-8 rounded-full" src={assets.profile_pic} alt="" />
            <img className="w-2.5" src={assets.dropdown_icon} alt="" />
            <div className="top-0 right-0 absolute pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block transition-all duration-300">
              <div className="min-w-48 bg-stone-100 flex gap-4 flex-col p-4 rounded">
                <p
                  onClick={() => navigate("/my-profile")}
                  className="cursor-pointer hover:text-black"
                >
                  My Profile
                </p>
                <p
                  onClick={() => navigate("/my-appointments")}
                  className="cursor-pointer hover:text-black"
                >
                  My Appointments
                </p>
                <p
                  onClick={() => setToken(false)}
                  className="cursor-pointer hover:text-black"
                >
                  {" "}
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-[#5F6FFF] px-8 py-3 text-white rounded-full hidden md:block font-light"
          >
            Craeate account
          </button>
        )}
        <img
          src={assets.menu_icon}
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          alt=""
        />
        {/* mobile menu */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "w-0 h-0"
          } md:hidden bottom-0 top-0 right-0 z-20 overflow-hidden bg-white transition-all duration-300`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-32" src={assets.logo} alt="" />
            <img
              className="w-7"
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg  font-medium">
            <NavLink onClick={() => setShowMenu(false)} to="/">
              Home
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/doctors">
              All Doctors
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/about">
              About
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to="/contact">
              Contact
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
