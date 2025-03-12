import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useContext, useEffect, useState } from "react";

function Doctor() {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilteredDoctors(
        doctors.filter((item) => item.speciality === speciality)
      );
    } else {
      setFilteredDoctors(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);
  return (
    <div>
      <p className="text-gray-600">Brower through the doctors speciality.</p>
      <div className="flex flex-col items-start gap-5 mt-5 sm:flex-row">
        <div className="flex-col gap-4 flex text-sm text-gray-600">
          <p
            onClick={() =>
              speciality == "General physician"
                ? navigate("/doctors")
                : navigate(`/doctors/General physician`)
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "General physician"
                ? "bg-indigo-100 text-black"
                : ""
            } `}
          >
            General physician
          </p>
          <p
            onClick={() =>
              speciality == "Gynecologist"
                ? navigate("/doctors")
                : navigate(`/doctors/Gynecologist`)
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gynecologist" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Gynecologist
          </p>
          <p
            onClick={() =>
              speciality == "Dermatologist"
                ? navigate("/doctors")
                : navigate(`/doctors/Dermatologist`)
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Dermatologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Dermatologist
          </p>
          <p
            onClick={() =>
              speciality == "Pediatricians"
                ? navigate("/doctors")
                : navigate(`/doctors/Pediatricians`)
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Pediatricians" ? "bg-indigo-100 text-black" : ""
            } `}
          >
            Pediatricians
          </p>
          <p
            onClick={() =>
              speciality == "Neurologist"
                ? navigate("/doctors")
                : navigate(`/doctors/Neurologist`)
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Neurologist" ? "bg-indigo-100 text-black" : ""
            }`}
          >
            Neurologist
          </p>
          <p
            onClick={() =>
              speciality == "Gastroenterologist"
                ? navigate("/doctors")
                : navigate(`/doctors/Gastroenterologist`)
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              speciality === "Gastroenterologist"
                ? "bg-indigo-100 text-black"
                : ""
            } `}
          >
            Gastroenterologist
          </p>
        </div>
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filteredDoctors.map((item, index) => (
            <div
              onClick={() => navigate(`/appointments/${item._id}`)}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={index}
            >
              <img className="bg-blue-50" src={item.image} alt="" />
              <div className="p-4">
                <div className="flex items-center gap-2  text-xs text-center">
                  {item.available ? (
                    <>
                      <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                      <p className="text-green-500">Available</p>
                    </>
                  ) : (
                    <>
                      <p className="w-2 h-2 bg-red-500 rounded-full"></p>
                      <p className="text-red-500"> Not Available</p>
                    </>
                  )}
                </div>
                <p className="text-lg font-medium text-gray-900">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctor;
