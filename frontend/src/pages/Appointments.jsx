import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-hot-toast";
import axios from "axios";
import ConfirmationModal from "../modals/ConfirmationModal";

function Appointments() {
  const { docId } = useParams();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const { doctors, currencySymbol, backendUrl, token, getAllDoctorsData } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState();
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
    console.log(docInfo);
  };

  const getAvailableSlots = async () => {
    if (!docInfo) return;
    setDocSlots([]);

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];
      while (currentDate < endTime) {
        let fomattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = fomattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: fomattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const handleBookAppointment = () => {
    if (!slotTime) {
      toast.error("Please select a time slot.");
      return;
    }
    setIsModalOpen(true); // Open the modal
  };

  const sendSMSNotification = async (appointmentDetails) => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/user-phone", {
        headers: { token },
      });
      if (!data.success || !data.phoneNumber) {
        console.log("Error: User phone number not found.");
        return;
      }

      console.log("User Phone Number:", data.phoneNumber);

      const message = `Appointment Confirmed! Doctor: ${docInfo.name}, Date: ${appointmentDetails.date}, Time: ${appointmentDetails.time}. Fee: ${currencySymbol}${docInfo.fees}. Thank you for choosing our service.`;

      const response = await axios.post(
        backendUrl + "/api/sms/send-sms",
        {
          phoneNumber: data.phoneNumber,
          message: message,
        },
        { headers: { token } }
      );

      if (response.data.success) {
        console.log("SMS notification sent successfully");
      } else {
        console.log("Failed to send SMS notification");
      }
    } catch (error) {
      console.error("Error sending SMS notification:", error);
    }
  };

  const confirmAppointment = async () => {
    setIsModalOpen(false); // Close the modal
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctorsData();

        // Send SMS notification
        await sendSMSNotification({
          date: date.toDateString(),
          time: slotTime,
        });

        navigate("/success");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  const shareOnWhatsApp = () => {
    const appointmentDetails = `📅 *Appointment Details*:

👨‍⚕️ *Doctor:* ${docInfo.name}
📆 *Date:* ${docSlots[slotIndex][0].datetime.toDateString()}
⏰ *Time:* ${slotTime}
💰 *Fee:* ${currencySymbol}${docInfo.fees}  `;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      appointmentDetails
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareViaGmail = () => {
    const appointmentDetails = `📅 *Appointment Details*:

👨‍⚕️ *Doctor:* ${docInfo.name}
📆 *Date:* ${docSlots[slotIndex][0].datetime.toDateString()}
⏰ *Time:* ${slotTime}
💰 *Fee:* ${currencySymbol}${docInfo.fees}  `;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(
      appointmentDetails
    )}`;
    window.open(gmailUrl, "_blank");
  };

  const copyToClipboard = async () => {
    const appointmentDetails = `📅 *Appointment Details*:

👨‍⚕️ *Doctor:* ${docInfo.name}
📆 *Date:* ${docSlots[slotIndex][0].datetime.toDateString()}
⏰ *Time:* ${slotTime}
💰 *Fee:* ${currencySymbol}${docInfo.fees}`;

    try {
      await navigator.clipboard.writeText(appointmentDetails);
      toast.success("Appointment details copied to clipboard!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy appointment details.");
    }
  };

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* doctor info */}
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={docInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            {/* --------doctor info:- name ,degree-------- */}

            <p className="flex items-center gap-2 text-2xl text-gray-900 font-semibold">
              {docInfo.name}{" "}
              <img src={assets.verified_icon} className="h-4 w-4" alt="" />
              <span className="text-sm ml-2">
                {docInfo.available ? "🟢 Available" : "🔴 Not Available"}
              </span>
            </p>
            <div className="flex items-center gap-2  text-sm text-gray-500 mt-1">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 p-2 border rounded-full text-xs">
                {docInfo.experience} Year
              </button>
            </div>
            <div>
              {/* --------doctor about-------- */}
              <p className="flex gap-1 text-sm text-gray-900 font-medium items-center mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-600 ">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>
        {/* -----booking slots--------- */}
        <div className="sm:ml-72 sm:pl-74 mt-4 font-medium text-gray-700">
          {docInfo.available ? (
            <>
              <p>Booking slots</p>
              <div className="flex items-center gap-3 w-full mt-4 overflow-x-auto">
                {docSlots.length &&
                  docSlots.map((item, index) => (
                    <div
                      onClick={() => setSlotIndex(index)}
                      className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                        slotIndex === index
                          ? "bg-primary text-white"
                          : "border border-gray-200"
                      }`}
                      key={index}
                    >
                      <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                      <p>{item[0] && item[0].datetime.getDate()}</p>
                    </div>
                  ))}
              </div>
              <div className="flex items-center gap-3 mt-4 w-full overflow-x-auto">
                {docSlots.length > 0 &&
                  docSlots[slotIndex] &&
                  docSlots[slotIndex].length > 0 &&
                  docSlots[slotIndex].map((item, index) => (
                    <p
                      onClick={() => setSlotTime(item.time)}
                      className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                        item.time === slotTime
                          ? "bg-primary text-white"
                          : "border border-gray-200 text-gray-400"
                      }`}
                      key={index}
                    >
                      {item.time.toLowerCase()}
                    </p>
                  ))}
              </div>
              <div className="flex items-start gap-3 mt-4 flex-col">
                <div className="flex gap-6 w-full items-center mt-2">
                  Share the Appointment detail:
                  <button onClick={shareOnWhatsApp}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/733/733585.png"
                      alt="WhatsApp"
                      width="25px"
                    />
                  </button>
                  <button onClick={shareViaGmail}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/281/281769.png"
                      alt="Gmail"
                      width="25px"
                    />
                  </button>
                  <button onClick={copyToClipboard}>
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/1828/1828911.png"
                      alt="Copy"
                      width="25px"
                    />
                  </button>
                </div>
                <button
                  onClick={handleBookAppointment}
                  className="bg-primary text-white rounded-full py-3 px-14 text-sm font-light my-6"
                >
                  Book an appointment
                </button>

                {/* Confirmation Modal */}
                <ConfirmationModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onConfirm={confirmAppointment}
                  doctor={docInfo}
                  selectedDate={docSlots[
                    slotIndex
                  ]?.[0]?.datetime?.toDateString()}
                  selectedTime={slotTime}
                  fee={docInfo.fees}
                  currencySymbol={currencySymbol}
                />
              </div>
            </>
          ) : (
            <div className="border border-red-400 bg-red-100 text-red-700 p-6 rounded-lg text-center">
              <p className="text-xl font-semibold">
                ⚠️ Doctor is currently unavailable
              </p>
              <p className="text-sm mt-2">
                Please check back later or browse other available doctors.
              </p>
              <button
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition"
                onClick={() => navigate("/doctors")}
              >
                Browse Other Doctors
              </button>
            </div>
          )}
        </div>
        {/* ---------------listing related doctors---------------- */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
}

export default Appointments;
