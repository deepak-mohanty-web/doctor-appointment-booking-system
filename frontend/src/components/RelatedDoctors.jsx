import { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

function RelatedDoctors({ docId, speciality }) {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const relatedDocs = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id != docId
      );
      setRelDoc(relatedDocs);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Related Doctors</h1>
      <p className="text-sm text-center sm:w-1/3">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] pt-5 gap-4 gap-y-6 px-3 sm:px-0">
        {relDoc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointments/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img className="bg-blue-50" src={item.image} alt="" />
            <div className="p-4">
              <div className="flex items-center gap-2 text-green-500 text-xs text-center">
                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                <p>Available</p>
              </div>
              <p className="text-lg font-medium text-gray-900">{item.name}</p>
              <p className="text-gray-600 text-sm">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
RelatedDoctors.propTypes = {
  docId: PropTypes.string.isRequired,
  speciality: PropTypes.string.isRequired,
};
export default RelatedDoctors;
