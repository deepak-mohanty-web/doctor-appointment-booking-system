import { assets } from "../assets/assets";
function Header() {
  return (
    <div className="flex flex-col md:flex-row bg-[#5F6FFF] px-6 md:px-10 lg:px-20 rounded-lg flex-wrap">
      {/* left side */}
      <div className="w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight lg:leading-tight md:leading-tight">
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className="flex flex-col md:flex-row text-sm text-white font-light items-center gap-3">
          <img className="w-28" src={assets.group_profiles} alt="" />
          <p>
            Simply browse through our extensive list of trusted doctors,
            <br className="hidden sm:block" />
            schedule your appointment hassle-free.
          </p>
        </div>
        <a
          href="#speciality"
          className="flex gap-2 items-center justify-center bg-white rounded-full px-8 py-3 text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book appointment{" "}
          <img src={assets.arrow_icon} alt="" className="w-3" />
        </a>
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
