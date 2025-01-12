import { assets } from "../assets/assets";

function Contact() {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-800 font-semibold">US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-10 justify-center mb-28 text-sm my-10">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />
        <div className="flex flex-col gap-6 justify-center items-start">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-600">
            00000 Willms Station <br /> Suite 000, Washington, USA
          </p>
          <p className="text-gray-600">
            Tel: (000) 000-0000 <br />
            Email: deepakkumarmohanty@gmail.com
          </p>
          <p className="font-semibold text-lg text-gray-600">
            CAREERS AT PRESCRIPTO
          </p>
          <p className="text-gray-600">
            Learn more about our teams and job openings.
          </p>
          <button className="px-8 py-4 border border-black hover:bg-black hover:text-white transition-all duration-500">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

export default Contact;
