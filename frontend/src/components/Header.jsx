import { assets } from "../assets/assets";

function Header() {
  return (
    <div className="flex flex-col md:flex-row bg-[#5F6FFF] px-6 md:px-10 lg:px-20 rounded-lg flex-wrap">
      {/* left side */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className="flex flex-col items-center gap-4">
          <img className="w-35 md:w-40" src={assets.group_profiles} alt="" />
          <p className="text-sm text-white font-light">
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden sm:block" />
            schedule your appointment hassle-free.
          </p>
        </div>
        <div className="flex justify-center w-full">
          <a
            href="#speciality"
            className="flex gap-2 items-center justify-center bg-white rounded-full px-8 py-3 text-gray-600 text-sm hover:scale-105 transition-all duration-300"
          >
            Book appointment
            <img src={assets.arrow_icon} alt="" className="w-3" />
          </a>
        </div>
      </div>
      {/* right side  */}
      <div className="md:w-1/2 relative">
        <img
          className="md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt=""
        />
      </div>
    </div>
  );
}

export default Header;
